import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { isNotFoundError } from '@/lib/api'
import { queryState } from '@/lib/queryState'

import { NOTE_PAGE_SIZE } from './api'
import { noteQueries } from './queries'
import type { NoteFilters } from './types'

/**
 * One page of the signed-in user's notes matching `filters`. When the filters or page change, the
 * previous results stay available (with `isStale` set) until the new ones arrive.
 */
export function useNotes(filters: NoteFilters, page = 1) {
  const query = useQuery({
    ...noteQueries.list(filters, page),
    placeholderData: keepPreviousData,
  })
  const count = query.data?.count ?? 0

  return {
    notes: query.data?.results ?? [],
    /** Matching notes across every page. */
    count,
    pageCount: Math.ceil(count / NOTE_PAGE_SIZE),
    /** The results shown are for different filters or another page; the current ones are on the way. */
    isStale: query.isPlaceholderData,
    /** `page` is past the last page, such as from an old link. */
    isPageNotFound: page > 1 && isNotFoundError(query.error),
    ...queryState(query),
  }
}
