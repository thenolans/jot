import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'

import { errorMessage } from '@/lib/api'
import { queryState } from '@/lib/queryState'

import { noteQueries } from './queries'
import type { Note, NoteFilters } from './types'

/**
 * The signed-in user's notes matching `filters`, a page at a time: `loadMore` adds the next page to
 * `notes`. When the filters change, the previous results stay available (with `isStale` set) until the
 * new ones arrive.
 */
export function useNotes(filters: NoteFilters) {
  const query = useInfiniteQuery({
    ...noteQueries.list(filters),
    placeholderData: keepPreviousData,
  })
  const pages = query.data?.pages ?? []

  // A note edited between loading one page and the next moves up the list, so it can come twice.
  const seen = new Set<number>()
  const notes: Note[] = []
  for (const note of pages.flatMap((page) => page.results)) {
    if (seen.has(note.id)) continue
    seen.add(note.id)
    notes.push(note)
  }

  return {
    notes,
    /** Matching notes across every page, loaded or not. */
    count: pages[0]?.count ?? 0,
    /** The results shown are for different filters; the current ones are on the way. */
    isStale: query.isPlaceholderData,
    /** There are more notes than `notes` holds. */
    hasMore: query.hasNextPage && !query.isPlaceholderData,
    isLoadingMore: query.isFetchingNextPage,
    /** Why the next page couldn't be loaded. */
    loadMoreError:
      query.isFetchNextPageError && query.error
        ? errorMessage(query.error)
        : null,
    loadMore: () => {
      if (query.hasNextPage && !query.isFetching) void query.fetchNextPage()
    },
    ...queryState(query),
  }
}
