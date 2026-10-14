import { onlineManager, QueryClient } from '@tanstack/react-query'

import { setNoteMutationDefaults } from '@/features/notes/mutations'
import { ApiError, isNetworkError } from '@/lib/api'
import { connectivity } from '@/lib/connectivity'

/** Attempts after the first before a failed request is reported. */
const MAX_RETRIES = 2

// Queries and saves wait for the API rather than the device's connection (see `connectivity`).
onlineManager.setEventListener((setOnline) => {
  setOnline(connectivity.isOnline())
  return connectivity.subscribe(setOnline)
})

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Show cached data straight away, refreshing it in the background once it's this old.
      staleTime: 30_000,
      // Try even when offline, so a screen with nothing saved says it can't load rather than waiting.
      networkMode: 'offlineFirst',
      // A client error (bad input, signed out, not found) won't go away by asking again, and once the
      // API can't be reached the query is refetched when it can.
      retry: (failureCount, error) =>
        !isNetworkError(error) &&
        !(
          error instanceof ApiError &&
          error.status >= 400 &&
          error.status < 500
        ) &&
        failureCount < MAX_RETRIES,
    },
    mutations: {
      // Fail straight away when offline, so forms say so instead of waiting. Changes that can wait
      // for the connection (saving a note's text) opt in with `networkMode: 'online'`.
      networkMode: 'always',
    },
  },
})

setNoteMutationDefaults(queryClient)
