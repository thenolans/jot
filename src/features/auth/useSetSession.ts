import { matchQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { clearSavedIds } from '@/lib/localIds'

import { authQueries } from './queries'
import type { User } from './types'

/** Switches the cache to a new session: `user` signed in, or `null` signed out. */
export function useSetSession() {
  const queryClient = useQueryClient()

  return useCallback(
    (user: User | null) => {
      // Cached data belongs to whoever was signed in before. Auth queries stay (removing the
      // session query would detach its observers), and the session gets the new user.
      queryClient.removeQueries({
        predicate: (query) =>
          !matchQuery({ queryKey: authQueries.all() }, query),
      })
      queryClient.setQueryData(authQueries.currentUser().queryKey, user)
      // Changes still waiting for the connection were theirs too.
      const mutationCache = queryClient.getMutationCache()
      for (const mutation of mutationCache.findAll({
        predicate: (mutation) => mutation.state.isPaused,
      }))
        mutationCache.remove(mutation)
      clearSavedIds()
    },
    [queryClient],
  )
}
