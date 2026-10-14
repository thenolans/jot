import type { QueryClient } from '@tanstack/react-query'

import { isNetworkError, isNotFoundError, type Page } from '@/lib/api'
import { refetchAfterLastMutation } from '@/lib/refetchAfterLastMutation'

import { deleteNote, updateNote } from './api'
import { noteQueries } from './queries'
import type { Note, NoteChanges } from './types'

/** Marks saves of a note's title and text, so they run one at a time and can be found together. */
export const updateNoteMutationKey = [...noteQueries.all(), 'update'] as const

/** Marks deletes of notes. */
export const deleteNoteMutationKey = [...noteQueries.all(), 'delete'] as const

export type UpdateNote = {
  id: number
  changes: NoteChanges
}

/**
 * Sets up the changes to notes that can wait for the connection: saving a note's title and text as
 * it's typed, and deleting a note. Saves are shown straight away and run one at a time, in order; once the last one settles the notes are refetched, which also undoes any that failed.
 * Offline, they wait for the connection and are kept on the device until it's back. Their options live
 * on the client rather than in a hook, so saves kept from before the app was closed can still be sent.
 */
export function setNoteMutationDefaults(queryClient: QueryClient) {
  queryClient.setMutationDefaults<Note, Error, UpdateNote>(
    updateNoteMutationKey,
    {
      mutationFn: ({ id, changes }) => updateNote(id, changes),
      scope: { id: 'notes' },
      networkMode: 'online',
      meta: { keepOffline: true },
      // Retrying a save that couldn't reach the API waits until it can. Without a delay it starts
      // waiting at once, which is when it's kept on the device.
      retry: (_, error) => isNetworkError(error),
      retryDelay: 0,
      onMutate: async ({ id, changes }) => {
        await queryClient.cancelQueries({ queryKey: noteQueries.all() })
        queryClient.setQueryData(
          noteQueries.detail(id).queryKey,
          (note) => note && { ...note, ...changes },
        )
        queryClient.setQueriesData<Page<Note>>(
          { queryKey: noteQueries.lists() },
          (page) =>
            page && {
              ...page,
              results: page.results.map((note) =>
                note.id === id ? { ...note, ...changes } : note,
              ),
            },
        )
      },
      onSettled: () =>
        refetchAfterLastMutation(
          queryClient,
          updateNoteMutationKey,
          noteQueries.all(),
        ),
    },
  )

  // Deleting a note takes it off the list straight away. It runs after the note's saves (they share a
  // scope) and, like them, waits for the connection when offline. A note that's already gone counts as
  // deleted, like an empty new note deleted from its menu, then again as it closes.
  queryClient.setMutationDefaults<void, Error, number>(deleteNoteMutationKey, {
    mutationFn: (id) =>
      deleteNote(id).catch((error: unknown) => {
        if (!isNotFoundError(error)) throw error
      }),
    scope: { id: 'notes' },
    networkMode: 'online',
    meta: { keepOffline: true },
    retry: (_, error) => isNetworkError(error),
    retryDelay: 0,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: noteQueries.all() })
      queryClient.removeQueries({ queryKey: noteQueries.detail(id).queryKey })
      queryClient.setQueriesData<Page<Note>>(
        { queryKey: noteQueries.lists() },
        (page) =>
          page?.results.some((note) => note.id === id)
            ? {
                ...page,
                count: page.count - 1,
                results: page.results.filter((note) => note.id !== id),
              }
            : page,
      )
    },
    onSettled: () =>
      refetchAfterLastMutation(
        queryClient,
        deleteNoteMutationKey,
        noteQueries.lists(),
      ),
  })
}
