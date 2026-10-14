import type { QueryClient } from '@tanstack/react-query'

import { folderQueries } from './queries'
import type { Folder } from './types'

/**
 * Puts a folder the API sent back into the cached list, in place of the one it was or sorted in by name,
 * so it shows without waiting for the list to reload. The list is then refetched in the background, for
 * the note counts the change affected.
 */
export function updateCachedFolders(queryClient: QueryClient, saved: Folder) {
  const { queryKey } = folderQueries.list()
  queryClient.setQueryData(queryKey, (folders) =>
    folders
      ?.filter((folder) => folder.id !== saved.id)
      .concat(saved)
      .sort((a, b) => a.name.localeCompare(b.name)),
  )
  void queryClient.invalidateQueries({ queryKey })
}
