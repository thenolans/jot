import { useQuery } from '@tanstack/react-query'

import { queryState } from '@/lib/queryState'

import { sharingQueries } from './queries'

/** Who one of the user's notes is shared with. */
export function useShares(noteId: number) {
  const query = useQuery(sharingQueries.list(noteId))

  return {
    shares: query.data ?? [],
    ...queryState(query),
  }
}
