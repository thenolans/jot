import { useQuery } from '@tanstack/react-query'

import { queryState } from '@/lib/queryState'

import { folderQueries } from './queries'

/** Every one of the signed-in user's folders, sorted by name, with their note counts. */
export function useFolders() {
  const query = useQuery(folderQueries.list())
  return { folders: query.data, ...queryState(query) }
}
