import { queryOptions } from '@tanstack/react-query'

import { keptOffline } from '@/lib/offlineQuery'

import { fetchFolders } from './api'

/** Query definitions for folders, nested under `['folders']`. */
export const folderQueries = {
  all: () => ['folders'] as const,

  /** Every one of the user's folders, with their note counts. */
  list: () =>
    queryOptions({
      queryKey: [...folderQueries.all(), 'list'] as const,
      queryFn: fetchFolders,
      ...keptOffline,
    }),
}
