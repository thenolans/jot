import { useMutation } from '@tanstack/react-query'

import { deleteFolderMutationKey } from './mutations'

/**
 * Deletes a folder with the folders and notes inside it, given its id. It goes straight away, and offline
 * it's deleted on the API once the connection is back (see `setFolderMutationDefaults`).
 */
export function useDeleteFolder() {
  return useMutation<void, Error, number>({
    mutationKey: deleteFolderMutationKey,
  })
}
