import { queryOptions } from '@tanstack/react-query'

import { isNetworkError } from '@/lib/api'
import { keptOffline } from '@/lib/offlineQuery'

import { fetchCurrentUser } from './api'

/** Query definitions for auth. Keys nest under `['auth']`. */
export const authQueries = {
  all: () => ['auth'] as const,

  /**
   * The signed-in user, or `null` when signed out. Checked once on load; signing in and out
   * write to it directly, so it never goes stale on its own.
   */
  currentUser: () =>
    queryOptions({
      queryKey: [...authQueries.all(), 'currentUser'] as const,
      // If the session can't be checked, carry on signed out, unless the API couldn't be reached:
      // offline, the user kept on the device stays signed in.
      queryFn: () =>
        fetchCurrentUser().catch((error: unknown) => {
          if (isNetworkError(error)) throw error
          return null
        }),
      staleTime: Infinity,
      ...keptOffline,
    }),
}
