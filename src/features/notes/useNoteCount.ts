import { useInfiniteQuery } from '@tanstack/react-query'

import { noteQueries } from './queries'
import type { NoteFilters } from './types'

/** How many notes match `filters` in all, from the first page of the list, once it's loaded. */
export function useNoteCount(filters: NoteFilters) {
  const { data } = useInfiniteQuery({
    ...noteQueries.list(filters),
    select: (list) => list.pages[0].count,
  })
  return data
}
