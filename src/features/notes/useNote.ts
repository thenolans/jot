import {
  type QueryClient,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { isNotFoundError, type Page } from '@/lib/api'
import { queryState } from '@/lib/queryState'

import { noteQueries } from './queries'
import type { Note } from './types'

/** The note with `id` from a page of the list already loaded, and when that page was loaded. */
function findInLists(queryClient: QueryClient, id: number) {
  for (const query of queryClient
    .getQueryCache()
    .findAll({ queryKey: noteQueries.lists() })) {
    const note = (query.state.data as Page<Note> | undefined)?.results.find(
      (note) => note.id === id,
    )
    if (note) return { note, updatedAt: query.state.dataUpdatedAt }
  }
  return undefined
}

/**
 * One of the signed-in user's notes, or none for `null`. A note opened from the list shows straight
 * away, from the list's data, while it's refreshed.
 */
export function useNote(id: number | null) {
  const queryClient = useQueryClient()
  const query = useQuery({
    ...noteQueries.detail(id),
    initialData: () =>
      id === null ? undefined : findInLists(queryClient, id)?.note,
    initialDataUpdatedAt: () =>
      id === null ? undefined : findInLists(queryClient, id)?.updatedAt,
  })

  return {
    note: query.data,
    /** There's no such note, or it isn't the user's. */
    isNotFound: isNotFoundError(query.error),
    ...queryState(query),
  }
}
