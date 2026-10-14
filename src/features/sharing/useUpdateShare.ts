import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateShare } from './api'
import type { Share, SharePermission } from './types'
import { updateCachedShares } from './updateCachedShares'

/** Changes what someone a note is shared with can do. */
export function useUpdateShare({ id, noteId }: Pick<Share, 'id' | 'noteId'>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (permission: SharePermission) => updateShare(id, permission),
    onSuccess: (share) =>
      updateCachedShares(queryClient, noteId, (shares) =>
        shares.map((other) => (other.id === id ? share : other)),
      ),
  })
}
