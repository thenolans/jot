import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createFolder } from './api'
import type { NewFolder } from './types'
import { updateCachedFolders } from './updateCachedFolders'

/** Makes a folder. It fails straight away offline. */
export function useCreateFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (folder: NewFolder) => createFolder(folder),
    onSuccess: (folder) => updateCachedFolders(queryClient, folder),
  })
}
