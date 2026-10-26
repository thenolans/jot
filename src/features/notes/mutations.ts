import type { QueryClient } from '@tanstack/react-query'

import { authQueries } from '@/features/auth/queries'
import { adjustNoteCount } from '@/features/folders/folderTree'
import { folderQueries } from '@/features/folders/queries'
import { updateCachedFolders } from '@/features/folders/updateCachedFolders'
import { ApiError, isNotFoundError } from '@/lib/api'
import { apiId, isSameId, recordSavedId, resolveId } from '@/lib/localIds'
import { offlineChange, refetchAfterLastChange } from '@/lib/offlineQuery'

import {
  createNote,
  deleteNote,
  fetchNote,
  isEditedElsewhere,
  moveNote,
  NOTE_TITLE_MAX_LENGTH,
  pinNote,
  updateNote,
} from './api'
import { findCachedNote, updateCachedNotes } from './noteCache'
import { changesFrom, mergeNote, textOf } from './noteText'
import { noteQueries } from './queries'
import type { NewNote, Note, NoteChanges, NoteText } from './types'

/** Marks saves of a note's title and text, so they can be found together. */
export const updateNoteMutationKey = [...noteQueries.all(), 'update'] as const

/** Marks new notes. */
export const createNoteMutationKey = [...noteQueries.all(), 'create'] as const

/** Marks notes moved to another folder. */
export const moveNoteMutationKey = [...noteQueries.all(), 'move'] as const

/** Marks notes pinned or unpinned. */
export const pinNoteMutationKey = [...noteQueries.all(), 'pin'] as const

/** Marks deletes of notes. */
export const deleteNoteMutationKey = [...noteQueries.all(), 'delete'] as const

/** A note's text as it was when an edit was made to it, and its revision then. */
export type NoteBase = NoteText & { revision: number }

export type UpdateNote = {
  id: number
  changes: NoteChanges
  /** What `changes` were made to, so they can be merged with any made elsewhere since. */
  base: NoteBase
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

export type PinNote = {
  id: number
  isPinned: boolean
}

/** How many times a save merges with edits made elsewhere before giving up, when more keep arriving. */
const MAX_MERGES = 3

/**
 * The last save of each note (by its API id) that went through as made, unmerged: the text it left, and the
 * note's revision after it. The next save, made to that text, is based on that revision, though it was
 * made before the save came back.
 */
const lastSaves = new Map<number, NoteBase>()

/**
 * Notes (by API id) whose edits here couldn't be merged with edits made elsewhere, so they were saved as a
 * copy: its id, and the note's revision then. Later saves of edits made before it (to an older revision) go
 * to the copy too.
 */
const conflictCopies = new Map<number, { copyId: number; revision: number }>()

const isSameText = (a: NoteText, b: NoteText) => !changesFrom(a, b)

/** "Groceries (conflicted copy)", short enough for a title. */
function copyTitle(title: string) {
  const suffix = ' (conflicted copy)'
  return (
    (title || 'Untitled').slice(0, NOTE_TITLE_MAX_LENGTH - suffix.length) +
    suffix
  )
}

/**
 * Saves `changes` to the note with API id `id`, made to `base`. When it's been edited elsewhere since, the
 * two edits are merged and saved; when they can't be, this one is saved as a copy, leaving the note as it was
 * edited elsewhere. Either way the cached note is swapped for the saved one.
 */
async function saveEdit(
  queryClient: QueryClient,
  id: number,
  base: NoteBase,
  changes: NoteChanges,
) {
  const mine = { ...textOf(base), ...changes }
  const last = lastSaves.get(id)
  const revision =
    last && isSameText(last, base) && last.revision > base.revision
      ? last.revision
      : base.revision
  try {
    const saved = await updateNote(id, changes, revision)
    lastSaves.set(id, { ...mine, revision: saved.revision })
    return saved
  } catch (error) {
    if (!isEditedElsewhere(error)) throw error
  }
  // The note now holds text this device's later edits weren't made to.
  lastSaves.delete(id)

  const swapCached = (saved: Note, add?: Note) =>
    updateCachedNotes(queryClient, {
      edit: (note) => (isSameId(note.id, id) ? saved : note),
      add,
    })
  for (let attempt = 0; attempt < MAX_MERGES; attempt++) {
    const theirs = await fetchNote(id)
    const merged = mergeNote(base, mine, theirs)
    if (!merged) {
      const copy = await createNote({
        ...mine,
        title: copyTitle(mine.title),
        folderId: theirs.access === 'owner' ? theirs.folderId : null,
      })
      conflictCopies.set(id, { copyId: copy.id, revision: theirs.revision })
      swapCached(theirs, copy)
      return copy
    }
    const toSave = changesFrom(merged, theirs)
    if (!toSave) {
      swapCached(theirs)
      return theirs
    }
    try {
      const saved = await updateNote(id, toSave, theirs.revision)
      swapCached(saved)
      return saved
    } catch (error) {
      if (!isEditedElsewhere(error)) throw error
    }
  }
  throw new ApiError(409, 'This note keeps being edited elsewhere.')
}

/** Once every change has been sent, the notes and folders are refetched, which also undoes any that failed. */
const refetchAll = (queryClient: QueryClient) =>
  refetchAfterLastChange(queryClient, [
    noteQueries.lists(),
    noteQueries.details(),
    folderQueries.all(),
  ])

/**
 * Sets up every change to notes: making one, saving its title and text as it's typed, moving it, pinning
 * it and deleting it. Each shows straight away, then is sent with the other changes, in order (see
 * `offlineChange`), so they all work offline. Their options live on the client rather than in a hook, so
 * changes kept from before the app was closed can still be sent. Edits to a note's title and text made
 * while it was edited elsewhere (say, offline) are merged with those edits (see `saveEdit`).
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
        const user = queryClient.getQueryData(
          authQueries.currentUser().queryKey,
        )
        const made: Note = {
          id,
          title: note.title ?? '',
          content: note.content ?? '',
          folderId: note.folderId ? resolveId(note.folderId) : null,
          access: 'owner',
          owner: { name: user?.name ?? '', email: user?.email ?? null },
          shareCount: 0,
          isPinned: false,
          isChecklist: false,
          revision: 0,
          createdAt: now,
          updatedAt: now,
        }
        // Before anything is awaited, so it's there to open as soon as it's made.
        queryClient.setQueryData(noteQueries.detail(id).queryKey, made)
        await cancelRefetches()
        updateCachedNotes(queryClient, { add: made })
        updateCachedFolders(queryClient, (folders) =>
          adjustNoteCount(folders, made.folderId, 1),
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
      mutationFn: ({ id, changes, base }) => {
        const noteId = apiId(id)
        const copy = conflictCopies.get(noteId)
        if (copy && base.revision < copy.revision)
          return updateNote(copy.copyId, changes)
        return saveEdit(queryClient, noteId, base, changes)
      },
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
        adjustNoteCount(adjustNoteCount(folders, from, -1), folderId, 1),
      )
    },
    onSettled: () => refetchAll(queryClient),
  })

  // Pinning isn't an edit, so the note keeps when it was last edited.
  queryClient.setMutationDefaults<Note, Error, PinNote>(pinNoteMutationKey, {
    ...offlineChange,
    mutationFn: ({ id, isPinned }) => pinNote(apiId(id), isPinned),
    onMutate: async ({ id, isPinned }) => {
      await cancelRefetches()
      updateCachedNotes(queryClient, {
        edit: (note) => (isSameId(note.id, id) ? { ...note, isPinned } : note),
      })
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
        adjustNoteCount(folders, folderId, -1),
      )
    },
    onSettled: () => refetchAll(queryClient),
  })
}
