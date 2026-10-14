import { useMutation, useQueryClient } from '@tanstack/react-query'

import { folderQueries } from '@/features/folders/queries'

import { createNote } from './api'
import { noteQueries } from './queries'
import type { NewNote } from './types'

/** Creates a note. It fails straight away offline, since there's no note to open until the API makes one. */
export function useCreateNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (note: NewNote) => createNote(note),
    onSuccess: (note) => {
      // The note opens without loading it again.
      queryClient.setQueryData(noteQueries.detail(note.id).queryKey, note)
      // Not awaited, so the note opens without waiting for the list or the folder counts.
      void queryClient.invalidateQueries({ queryKey: noteQueries.lists() })
      void queryClient.invalidateQueries({ queryKey: folderQueries.all() })
    },
  })
}
