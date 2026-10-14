import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createShare } from './api'
import type { ShareInput } from './types'
import { updateCachedShares } from './updateCachedShares'

/** Shares one of the user's notes with someone new, adding them to the end of its list. */
export function useCreateShare() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ShareInput) => createShare(input),
    onSuccess: (share) =>
      updateCachedShares(queryClient, share.noteId, (shares) => [
        ...shares,
        share,
      ]),
  })
}
