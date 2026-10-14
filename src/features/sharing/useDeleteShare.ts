import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteShare } from './api'
import type { Share } from './types'
import { updateCachedShares } from './updateCachedShares'

/** Stops sharing a note with someone. */
export function useDeleteShare({ id, noteId }: Pick<Share, 'id' | 'noteId'>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteShare(id),
    onSuccess: () =>
      updateCachedShares(queryClient, noteId, (shares) =>
        shares.filter((share) => share.id !== id),
      ),
  })
}
