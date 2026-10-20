import {
  type QueryClient,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useState } from 'react'

import { isNotFoundError, type Page } from '@/lib/api'
import { queryState } from '@/lib/queryState'

import { noteQueries } from './queries'
import type { Note } from './types'

/** The note with `id` from a page of the list already loaded. */
function findInLists(queryClient: QueryClient, id: number) {
  for (const query of queryClient
    .getQueryCache()
    .findAll({ queryKey: noteQueries.lists() })) {
    const note = (query.state.data as Page<Note> | undefined)?.results.find(
      (note) => note.id === id,
    )
    if (note) return note
  }
  return undefined
}

/**
 * One of the signed-in user's notes, or none for `null`. A note opened from the list shows straight
 * away, from the list's data, while it's refreshed. It's refreshed every time it's opened, however
 * recently it was loaded, since it may have been edited on another device since.
 */
export function useNote(id: number | null) {
  const queryClient = useQueryClient()
  const query = useQuery({
    ...noteQueries.detail(id),
    initialData: () => (id === null ? undefined : findInLists(queryClient, id)),
    refetchOnMount: 'always',
  })
  // The note whose refresh on opening has come back (or failed), so it's as up to date as it can be.
  const [checkedId, setCheckedId] = useState<number | null>(null)
  if (!query.isFetching && checkedId !== id) setCheckedId(id)

  return {
    note: query.data,
    /** It's being refreshed since it was opened, so what's shown may be out of date. */
    isChecking: id !== null && checkedId !== id,
    /** There's no such note, or it isn't the user's. */
    isNotFound: isNotFoundError(query.error),
    ...queryState(query),
  }
}
