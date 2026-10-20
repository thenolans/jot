import { useMutation } from '@tanstack/react-query'

import { type PinNote, pinNoteMutationKey } from './mutations'
import type { Note } from './types'

/**
 * Pins one of the user's notes ahead of the rest, or unpins it. It shows straight away, and offline it's
 * saved once the connection is back (see `setNoteMutationDefaults`).
 */
export function usePinNote() {
  return useMutation<Note, Error, PinNote>({
    mutationKey: pinNoteMutationKey,
  })
}
