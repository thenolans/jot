import { useQuery } from '@tanstack/react-query'

import { noteQueries } from './queries'

/** How many notes the user has in all, from the first page of the unfiltered list, once it's loaded. */
export function useNoteCount() {
  const { data } = useQuery({
    ...noteQueries.list({}, 1),
    select: (page) => page.count,
  })
  return data
}
