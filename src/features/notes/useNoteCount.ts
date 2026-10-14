import { useQuery } from '@tanstack/react-query'

import { noteQueries } from './queries'
import type { NoteFilters } from './types'

/** How many notes match `filters` in all, from the first page of the list, once it's loaded. */
export function useNoteCount(filters: NoteFilters) {
  const { data } = useQuery({
    ...noteQueries.list(filters, 1),
    select: (page) => page.count,
  })
  return data
}
