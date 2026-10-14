import { useMutation } from '@tanstack/react-query'

import { newLocalId } from '@/lib/localIds'

import { type CreateFolder, createFolderMutationKey } from './mutations'
import type { Folder, NewFolder } from './types'

/**
 * Makes a folder, returning a function that makes one and returns its id. It shows straight away, by a
 * local id, and is saved once the connection allows (see `setFolderMutationDefaults`).
 */
export function useCreateFolder() {
  const { mutate } = useMutation<Folder, Error, CreateFolder>({
    mutationKey: createFolderMutationKey,
  })
  return (folder: NewFolder) => {
    const id = newLocalId()
    mutate({ id, folder })
    return id
  }
}
