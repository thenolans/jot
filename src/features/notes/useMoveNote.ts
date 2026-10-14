import { useMutation } from '@tanstack/react-query'

import { type MoveNote, moveNoteMutationKey } from './mutations'
import type { Note } from './types'

/**
 * Moves a note into a folder, or out of any for `null`. It shows straight away, and offline it's saved
 * once the connection is back (see `setNoteMutationDefaults`).
 */
export function useMoveNote() {
  return useMutation<Note, Error, MoveNote>({
    mutationKey: moveNoteMutationKey,
  })
}
