import { useMutation, useQueryClient } from '@tanstack/react-query'

import { noteQueries } from '@/features/notes/queries'

import { deleteFolder } from './api'
import { folderQueries } from './queries'

/** Deletes a folder with the folders and notes inside it, given its id. It fails straight away offline. */
export function useDeleteFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteFolder(id),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: folderQueries.all() }),
        queryClient.invalidateQueries({ queryKey: noteQueries.all() }),
      ]),
  })
}
