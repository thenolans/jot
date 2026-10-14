import {
  type QueryClient,
  queryOptions,
  skipToken,
} from '@tanstack/react-query'

import { folderQueries } from '@/features/folders/queries'
import { ApiError, isNetworkError } from '@/lib/api'
import { connectivity } from '@/lib/connectivity'
import { apiId, isLocalId, isSameId, resolveId } from '@/lib/localIds'
import { keptOffline } from '@/lib/offlineQuery'

import { fetchAllNotes, fetchNote, fetchNotes } from './api'
import { notesPage } from './notesPage'
import type { Note, NoteFilters } from './types'

/** How long the copy of every note goes before it's refreshed, when the app is opened or comes back into view. */
const OFFLINE_COPY_STALE_TIME = 5 * 60 * 1000

/**
 * Asks the API with `fetch`, unless the device knows the answer (`local` gives something) and either the
 * API can't be reached or `preferLocal`. A request that finds the API can't be reached falls back to it.
 */
async function localOrFetch<T>(
  local: () => T | undefined,
  fetch: () => Promise<T>,
  preferLocal = false,
) {
  if (preferLocal || !connectivity.isOnline()) {
    const found = local()
    if (found !== undefined) return found
  }
  try {
    return await fetch()
  } catch (error) {
    const found = isNetworkError(error) ? local() : undefined
    if (found === undefined) throw error
    return found
  }
}

/**
 * Query definitions for notes. Keys nest under `['notes']`, then the kind of query (`'list'`,
 * `'detail'`), so a prefix invalidates every query beneath it.
 *
 * Every note is also kept on the device (`offlineCopy`), and while the API can't be reached, the list and
 * notes are answered from it.
 */
export const noteQueries = {
  all: () => ['notes'] as const,

  /**
   * Every one of the user's notes, kept on the device so they can be listed, searched and opened offline.
   * Changes update it as they're made, so it's only refreshed now and then, not with the list.
   */
  offlineCopy: () =>
    queryOptions({
      queryKey: [...noteQueries.all(), 'offline'] as const,
      queryFn: fetchAllNotes,
      staleTime: OFFLINE_COPY_STALE_TIME,
      ...keptOffline,
    }),

  lists: () => [...noteQueries.all(), 'list'] as const,

  /** One page of the user's notes matching `filters`. */
  list: ({ query = '', folderId = null }: NoteFilters, page: number) =>
    queryOptions({
      queryKey: [...noteQueries.lists(), { query, folderId, page }] as const,
      queryFn: ({ client }) =>
        localOrFetch(
          () => {
            const found = localList(client, { query, folderId }, page)
            if (found === null)
              throw new ApiError(404, 'There are no notes on this page.')
            return found
          },
          () =>
            fetchNotes(
              { query, folderId: folderId && resolveId(folderId) },
              page,
            ),
        ),
      ...keptOffline,
    }),

  details: () => [...noteQueries.all(), 'detail'] as const,

  /** One of the user's notes, or nothing to load for `null` (a note still being created). */
  detail: (id: number | null) =>
    queryOptions({
      queryKey: [...noteQueries.details(), id] as const,
      queryFn:
        id === null
          ? skipToken
          : ({ client }) =>
              localOrFetch(
                () =>
                  client
                    .getQueryData(noteQueries.offlineCopy().queryKey)
                    ?.find((note) => isSameId(note.id, id)),
                () => fetchNote(apiId(id)),
                // The API hasn't got a note made offline until it's saved.
                isLocalId(resolveId(id)),
              ),
      ...keptOffline,
    }),
}

/**
 * A page of the list from the copy of every note, `undefined` when there's no copy, or `null` past the
 * last page.
 */
export function localList(
  queryClient: QueryClient,
  filters: NoteFilters,
  page: number,
) {
  const notes = queryClient.getQueryData<Note[]>(
    noteQueries.offlineCopy().queryKey,
  )
  if (!notes) return undefined
  const folders = queryClient.getQueryData(folderQueries.list().queryKey) ?? []
  const folderId = filters.folderId ?? null
  return notesPage(
    notes,
    folders,
    {
      ...filters,
      folderId:
        folderId === null
          ? null
          : (folders.find((folder) => isSameId(folder.id, folderId))?.id ??
            folderId),
    },
    page,
  )
}
