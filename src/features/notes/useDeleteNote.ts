import { useMutation } from '@tanstack/react-query'

import { deleteNoteMutationKey } from './mutations'

/**
 * Deletes a note, given its id. It goes straight away, and offline it's deleted on the API once the
 * connection is back (see `setNoteMutationDefaults`).
 */
export function useDeleteNote() {
  return useMutation<void, Error, number>({
    mutationKey: deleteNoteMutationKey,
  })
}
