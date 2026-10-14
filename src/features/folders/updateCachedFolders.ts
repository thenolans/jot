import type { QueryClient } from '@tanstack/react-query'

import { folderQueries } from './queries'
import type { Folder } from './types'

/** Shows a change to the user's folders straight away, by changing the cached list with `update`. */
export function updateCachedFolders(
  queryClient: QueryClient,
  update: (folders: Folder[]) => Folder[],
) {
  queryClient.setQueryData(
    folderQueries.list().queryKey,
    (folders) => folders && update(folders),
  )
}
