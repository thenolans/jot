import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { isNotFoundError } from '@/lib/api'
import { queryState } from '@/lib/queryState'

import { findCachedNote } from './noteCache'
import { noteQueries } from './queries'

/**
 * One of the signed-in user's notes, or none for `null`. A note already cached (in the list, or the
 * copy kept offline) shows straight away while it's refreshed. It's refreshed every time it's opened, however
 * recently it was loaded, since it may have been edited on another device since.
 */
export function useNote(id: number | null) {
  const queryClient = useQueryClient()
  const query = useQuery({
    ...noteQueries.detail(id),
    initialData: () =>
      id === null ? undefined : findCachedNote(queryClient, id),
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
