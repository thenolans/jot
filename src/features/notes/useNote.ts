import { useQuery, useQueryClient } from '@tanstack/react-query'

import { isNotFoundError } from '@/lib/api'
import { queryState } from '@/lib/queryState'

import { findCachedNote } from './noteCache'
import { noteQueries } from './queries'

/**
 * One of the signed-in user's notes, or none for `null`. A note already cached (in the list, or the
 * copy kept offline) shows straight away while it's refreshed. It's refreshed every time it's opened, however
 * recently it was loaded, since it may have been edited on another device since. It can be edited while
 * that's on its way (or can't get through, offline): a later version is merged with what's typed.
 */
export function useNote(id: number | null) {
  const queryClient = useQueryClient()
  const query = useQuery({
    ...noteQueries.detail(id),
    initialData: () =>
      id === null ? undefined : findCachedNote(queryClient, id),
    refetchOnMount: 'always',
  })

  return {
    note: query.data,
    /** There's no such note, or it isn't the user's. */
    isNotFound: isNotFoundError(query.error),
    ...queryState(query),
  }
}
