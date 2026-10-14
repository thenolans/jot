import { useQuery } from '@tanstack/react-query'

import { authQueries } from './queries'

/** The signed-in user, or `null` when signed out. */
export function useCurrentUser() {
  const { data, isPending } = useQuery(authQueries.currentUser())

  return {
    user: data ?? null,
    /** True until the existing session (if any) has been checked. */
    isLoading: isPending,
  }
}
