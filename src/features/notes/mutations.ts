import type { QueryClient } from '@tanstack/react-query'

import { adjustNoteCounts } from '@/features/folders/folderTree'
import { folderQueries } from '@/features/folders/queries'
import { updateCachedFolders } from '@/features/folders/updateCachedFolders'
import { isNotFoundError } from '@/lib/api'
import { apiId, isSameId, recordSavedId, resolveId } from '@/lib/localIds'
import { offlineChange, refetchAfterLastChange } from '@/lib/offlineQuery'

import { createNote, deleteNote, moveNote, updateNote } from './api'
import { findCachedNote, updateCachedNotes } from './noteCache'
import { noteQueries } from './queries'
import type { NewNote, Note, NoteChanges } from './types'

/** Marks saves of a note's title and text, so they can be found together. */
export const updateNoteMutationKey = [...noteQueries.all(), 'update'] as const

/** Marks new notes. */
export const createNoteMutationKey = [...noteQueries.all(), 'create'] as const

/** Marks notes moved to another folder. */
export const moveNoteMutationKey = [...noteQueries.all(), 'move'] as const

/** Marks deletes of notes. */
export const deleteNoteMutationKey = [...noteQueries.all(), 'delete'] as const

export type UpdateNote = {
  id: number
  changes: NoteChanges
}

export type CreateNote = {
  /** The note's local id (`newLocalId`), which it goes by until it's saved. */
  id: number
  note: NewNote
}

export type MoveNote = {
  id: number
  /** The folder to move it to, or `null` for none. */
  folderId: number | null
}

/** Once every change has been sent, the notes and folders are refetched, which also undoes any that failed. */
const refetchAll = (queryClient: QueryClient) =>
  refetchAfterLastChange(queryClient, [
    noteQueries.lists(),
    noteQueries.details(),
    folderQueries.all(),
  ])

/**
 * Sets up every change to notes: making one, saving its title and text as it's typed, moving it and
 * deleting it. Each shows straight away, then is sent with the other changes, in order (see
 * `offlineChange`), so they all work offline. Their options live on the client rather than in a hook, so
 * changes kept from before the app was closed can still be sent.
 */
export function setNoteMutationDefaults(queryClient: QueryClient) {
  const cancelRefetches = () =>
    queryClient.cancelQueries({ queryKey: noteQueries.all() })

  // A note made offline goes by a local id until it's saved, then by the one the API gave it.
  queryClient.setMutationDefaults<Note, Error, CreateNote>(
    createNoteMutationKey,
    {
      ...offlineChange,
      mutationFn: async ({ id, note }) => {
        const saved = await createNote({
          ...note,
          folderId: note.folderId && apiId(note.folderId),
        })
        recordSavedId(id, saved.id)
        return saved
      },
      onMutate: async ({ id, note }) => {
        const now = new Date().toISOString()
        const made: Note = {
          id,
          title: note.title ?? '',
          content: note.content ?? '',
          folderId: note.folderId ? resolveId(note.folderId) : null,
          createdAt: now,
          updatedAt: now,
        }
        // Before anything is awaited, so it's there to open as soon as it's made.
        queryClient.setQueryData(noteQueries.detail(id).queryKey, made)
        await cancelRefetches()
        updateCachedNotes(queryClient, { add: made })
        updateCachedFolders(queryClient, (folders) =>
          adjustNoteCounts(folders, made.folderId, 1),
        )
      },
      onSuccess: (saved, { id }) => {
        updateCachedNotes(queryClient, {
          edit: (note) =>
            note.id === id
              ? { ...note, id: saved.id, createdAt: saved.createdAt }
              : note,
        })
        const note = queryClient.getQueryData(noteQueries.detail(id).queryKey)
        if (note)
          queryClient.setQueryData(noteQueries.detail(saved.id).queryKey, note)
      },
      onSettled: () => refetchAll(queryClient),
    },
  )

  queryClient.setMutationDefaults<Note, Error, UpdateNote>(
    updateNoteMutationKey,
    {
      ...offlineChange,
      mutationFn: ({ id, changes }) => updateNote(apiId(id), changes),
      onMutate: async ({ id, changes }) => {
        await cancelRefetches()
        const updatedAt = new Date().toISOString()
        updateCachedNotes(queryClient, {
          edit: (note) =>
            isSameId(note.id, id) ? { ...note, ...changes, updatedAt } : note,
        })
      },
      onSettled: () => refetchAll(queryClient),
    },
  )

  queryClient.setMutationDefaults<Note, Error, MoveNote>(moveNoteMutationKey, {
    ...offlineChange,
    mutationFn: ({ id, folderId }) =>
      moveNote(apiId(id), folderId && apiId(folderId)),
    onMutate: async ({ id, folderId: to }) => {
      const folderId = to && resolveId(to)
      await cancelRefetches()
      const from = findCachedNote(queryClient, id)?.folderId ?? null
      updateCachedNotes(queryClient, {
        edit: (note) => (isSameId(note.id, id) ? { ...note, folderId } : note),
      })
      updateCachedFolders(queryClient, (folders) =>
        adjustNoteCounts(adjustNoteCounts(folders, from, -1), folderId, 1),
      )
    },
    onSettled: () => refetchAll(queryClient),
  })

  // Deleting a note runs after its saves, like any change. A note that's already gone counts as deleted,
  // like an empty new note deleted from its menu, then again as it closes, or one made offline that
  // couldn't be saved.
  queryClient.setMutationDefaults<void, Error, number>(deleteNoteMutationKey, {
    ...offlineChange,
    mutationFn: async (id) => {
      try {
        await deleteNote(apiId(id))
      } catch (error) {
        if (!isNotFoundError(error)) throw error
      }
    },
    onMutate: async (id) => {
      await cancelRefetches()
      const folderId = findCachedNote(queryClient, id)?.folderId ?? null
      updateCachedNotes(queryClient, {
        edit: (note) => (isSameId(note.id, id) ? null : note),
      })
      updateCachedFolders(queryClient, (folders) =>
        adjustNoteCounts(folders, folderId, -1),
      )
    },
    onSettled: () => refetchAll(queryClient),
  })
}
