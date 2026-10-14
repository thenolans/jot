import { useMutation } from '@tanstack/react-query'

import { type UpdateFolder, updateFolderMutationKey } from './mutations'
import type { Folder } from './types'

/**
 * Renames or moves a folder. It shows straight away, and offline it's saved once the connection is back
 * (see `setFolderMutationDefaults`).
 */
export function useUpdateFolder() {
  return useMutation<Folder, Error, UpdateFolder>({
    mutationKey: updateFolderMutationKey,
  })
}
