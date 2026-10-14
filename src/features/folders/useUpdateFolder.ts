import { useMutation, useQueryClient } from '@tanstack/react-query'

import { noteQueries } from '@/features/notes/queries'

import { updateFolder } from './api'
import type { FolderChanges } from './types'
import { updateCachedFolders } from './updateCachedFolders'

/** Renames or moves a folder. It fails straight away offline. */
export function useUpdateFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, changes }: { id: number; changes: FolderChanges }) =>
      updateFolder(id, changes),
    onSuccess: (folder, { changes }) => {
      updateCachedFolders(queryClient, folder)
      // Its notes leave the folders it was in and join those it's in now.
      if (changes.parentId !== undefined)
        void queryClient.invalidateQueries({ queryKey: noteQueries.lists() })
    },
  })
}
