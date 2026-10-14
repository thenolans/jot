import { useMutation } from '@tanstack/react-query'

import { type UpdateNote, updateNoteMutationKey } from './mutations'
import type { Note } from './types'

/**
 * Saves changes to a note's title or text. Offline, they're saved once the connection is back (see
 * `setNoteMutationDefaults`).
 */
export function useUpdateNote() {
  return useMutation<Note, Error, UpdateNote>({
    mutationKey: updateNoteMutationKey,
  })
}
