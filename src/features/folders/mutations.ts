import type { QueryClient } from '@tanstack/react-query'

import { updateCachedNotes } from '@/features/notes/noteCache'
import { noteQueries } from '@/features/notes/queries'
import { isNotFoundError } from '@/lib/api'
import { apiId, isSameId, recordSavedId, resolveId } from '@/lib/localIds'
import { offlineChange, refetchAfterLastChange } from '@/lib/offlineQuery'

import { createFolder, deleteFolder, updateFolder } from './api'
import { adjustNoteCounts, sortFolders, withDescendants } from './folderTree'
import { folderQueries } from './queries'
import type { Folder, FolderChanges, NewFolder } from './types'
import { updateCachedFolders } from './updateCachedFolders'

/** Marks new folders. */
export const createFolderMutationKey = [
  ...folderQueries.all(),
  'create',
] as const

/** Marks folders renamed or moved. */
export const updateFolderMutationKey = [
  ...folderQueries.all(),
  'update',
] as const

/** Marks deletes of folders. */
export const deleteFolderMutationKey = [
  ...folderQueries.all(),
  'delete',
] as const

export type CreateFolder = {
  /** The folder's local id (`newLocalId`), which it goes by until it's saved. */
  id: number
  folder: NewFolder
}

export type UpdateFolder = {
  id: number
  changes: FolderChanges
}

/** Once every change has been sent, the folders and notes are refetched, which also undoes any that failed. */
const refetchAll = (queryClient: QueryClient) =>
  refetchAfterLastChange(queryClient, [
    folderQueries.all(),
    noteQueries.lists(),
    noteQueries.details(),
  ])

/**
 * Sets up every change to folders: making, renaming, moving and deleting them. Each shows straight away,
 * then is sent with the other changes to folders and notes, in order (see `offlineChange`), so they all
 * work offline. Their options live on the client rather than in a hook, so changes kept from before the
 * app was closed can still be sent.
 */
export function setFolderMutationDefaults(queryClient: QueryClient) {
  const cancelRefetches = () =>
    Promise.all([
      queryClient.cancelQueries({ queryKey: folderQueries.all() }),
      queryClient.cancelQueries({ queryKey: noteQueries.all() }),
    ])

  // A folder made offline goes by a local id until it's saved, then by the one the API gave it.
  queryClient.setMutationDefaults<Folder, Error, CreateFolder>(
    createFolderMutationKey,
    {
      ...offlineChange,
      mutationFn: async ({ id, folder }) => {
        const saved = await createFolder({
          ...folder,
          parentId: folder.parentId && apiId(folder.parentId),
        })
        recordSavedId(id, saved.id)
        return saved
      },
      onMutate: async ({ id, folder }) => {
        await cancelRefetches()
        const made: Folder = {
          id,
          name: folder.name,
          parentId: folder.parentId && resolveId(folder.parentId),
          noteCount: 0,
        }
        updateCachedFolders(queryClient, (folders) =>
          sortFolders([...folders, made]),
        )
      },
      onSuccess: (saved, { id }) => {
        const swap = (folderId: number | null) =>
          folderId === id ? saved.id : folderId
        updateCachedFolders(queryClient, (folders) =>
          folders.map((folder) => ({
            ...folder,
            id: swap(folder.id) ?? folder.id,
            parentId: swap(folder.parentId),
          })),
        )
        updateCachedNotes(queryClient, {
          edit: (note) => ({ ...note, folderId: swap(note.folderId) }),
        })
      },
      onSettled: () => refetchAll(queryClient),
    },
  )

  // A folder moved takes its notes with it, out of the folders it was in and into those it's in now.
  queryClient.setMutationDefaults<Folder, Error, UpdateFolder>(
    updateFolderMutationKey,
    {
      ...offlineChange,
      mutationFn: ({ id, changes: { name, parentId } }) =>
        updateFolder(apiId(id), {
          name,
          parentId: parentId && apiId(parentId),
        }),
      onMutate: async ({ id, changes }) => {
        await cancelRefetches()
        const parentId =
          changes.parentId === undefined
            ? undefined
            : changes.parentId && resolveId(changes.parentId)
        updateCachedFolders(queryClient, (folders) => {
          const folder = folders.find((folder) => isSameId(folder.id, id))
          if (!folder) return folders
          const moved =
            parentId === undefined || parentId === folder.parentId
              ? folders
              : adjustNoteCounts(
                  adjustNoteCounts(folders, folder.parentId, -folder.noteCount),
                  parentId,
                  folder.noteCount,
                )
          return sortFolders(
            moved.map((each) =>
              each.id === folder.id
                ? {
                    ...each,
                    name: changes.name ?? each.name,
                    parentId: parentId === undefined ? each.parentId : parentId,
                  }
                : each,
            ),
          )
        })
        if (parentId !== undefined) updateCachedNotes(queryClient, {})
      },
      onSettled: () => refetchAll(queryClient),
    },
  )

  // Deleting a folder deletes the folders and notes inside it. One that's already gone counts as deleted.
  queryClient.setMutationDefaults<void, Error, number>(
    deleteFolderMutationKey,
    {
      ...offlineChange,
      mutationFn: async (id) => {
        try {
          await deleteFolder(apiId(id))
        } catch (error) {
          if (!isNotFoundError(error)) throw error
        }
      },
      onMutate: async (id) => {
        await cancelRefetches()
        const folders = queryClient.getQueryData(folderQueries.list().queryKey)
        const folder = folders?.find((folder) => isSameId(folder.id, id))
        if (!folders || !folder) return
        const deleted = withDescendants(folders, folder.id)
        updateCachedFolders(queryClient, () =>
          adjustNoteCounts(folders, folder.parentId, -folder.noteCount).filter(
            (each) => !deleted.has(each.id),
          ),
        )
        updateCachedNotes(queryClient, {
          edit: (note) =>
            note.folderId !== null && deleted.has(note.folderId) ? null : note,
        })
      },
      onSettled: () => refetchAll(queryClient),
    },
  )
}
