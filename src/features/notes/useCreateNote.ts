import { useMutation } from '@tanstack/react-query'

import { newLocalId } from '@/lib/localIds'

import { type CreateNote, createNoteMutationKey } from './mutations'
import type { NewNote, Note } from './types'

/**
 * Makes a note, returning a function that makes one and returns its id. It's there to open straight away,
 * by a local id, and is saved once the connection allows (see `setNoteMutationDefaults`).
 */
export function useCreateNote() {
  const { mutate } = useMutation<Note, Error, CreateNote>({
    mutationKey: createNoteMutationKey,
  })
  return (note: NewNote) => {
    const id = newLocalId()
    mutate({ id, note })
    return id
  }
}
