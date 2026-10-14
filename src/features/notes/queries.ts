import { queryOptions, skipToken } from '@tanstack/react-query'

import { keptOffline } from '@/lib/offlineQuery'

import { fetchNote, fetchNotes } from './api'
import type { NoteFilters } from './types'

/**
 * Query definitions for notes. Keys nest under `['notes']`, then the kind of query (`'list'`,
 * `'detail'`), so a prefix invalidates every query beneath it.
 */
export const noteQueries = {
  all: () => ['notes'] as const,

  lists: () => [...noteQueries.all(), 'list'] as const,

  /** One page of the user's notes matching `filters`. */
  list: ({ query = '', folderId = null }: NoteFilters, page: number) =>
    queryOptions({
      queryKey: [...noteQueries.lists(), { query, folderId, page }] as const,
      queryFn: () => fetchNotes({ query, folderId }, page),
      ...keptOffline,
    }),

  details: () => [...noteQueries.all(), 'detail'] as const,

  /** One of the user's notes, or nothing to load for `null` (a note still being created). */
  detail: (id: number | null) =>
    queryOptions({
      queryKey: [...noteQueries.details(), id] as const,
      queryFn: id === null ? skipToken : () => fetchNote(id),
      ...keptOffline,
    }),
}
