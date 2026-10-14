import { useMutation, useQueryClient } from '@tanstack/react-query'

import { folderQueries } from '@/features/folders/queries'

import { moveNote } from './api'
import { noteQueries } from './queries'

/** Moves a note into a folder, or out of any for `null`. It fails straight away offline. */
export function useMoveNote(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (folderId: number | null) => moveNote(id, folderId),
    onSuccess: (note) => {
      queryClient.setQueryData(noteQueries.detail(note.id).queryKey, note)
      // It leaves the lists of the folders it was in, and its counts go with it.
      void queryClient.invalidateQueries({ queryKey: noteQueries.lists() })
      void queryClient.invalidateQueries({ queryKey: folderQueries.all() })
    },
  })
}
