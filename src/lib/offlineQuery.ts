import type { QueryClient, QueryKey } from '@tanstack/react-query'

import { isNetworkError } from './api'

/** How long data kept for offline use stays on the device without being used. */
export const OFFLINE_MAX_AGE = 7 * 24 * 60 * 60 * 1000

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: {
      /** Save the data on the device, so it's still there offline and after the app is closed. */
      keepOffline?: boolean
    }
    mutationMeta: {
      /** While the change waits for the connection, keep it on the device, to send even after the app is reopened. */
      keepOffline?: boolean
    }
  }
}

/**
 * Options for a query whose data is kept on the device, for use offline. It also stays in memory as
 * long, since only what's in memory is saved.
 */
export const keptOffline = {
  meta: { keepOffline: true },
  gcTime: OFFLINE_MAX_AGE,
}

/**
 * Options for a change that can be made offline, for `setMutationDefaults`. Every such change runs one at a
 * time, in the order made, so one can depend on another (a note put in a folder made offline). Offline,
 * they wait for the connection and are kept on the device until it's back.
 */
export const offlineChange = {
  scope: { id: 'changes' },
  networkMode: 'online',
  meta: { keepOffline: true },
  // Retrying a change that couldn't reach the API waits until it can. Without a delay it starts
  // waiting at once, which is when it's kept on the device.
  retry: (_: number, error: Error) => isNetworkError(error),
  retryDelay: 0,
} as const

/**
 * For an `offlineChange`'s `onSettled`: refetches `queryKeys` once no other change is still waiting, so a
 * run of quick changes refetches once, after the last, which also undoes any that failed.
 */
export function refetchAfterLastChange(
  queryClient: QueryClient,
  queryKeys: QueryKey[],
) {
  // The settling change is still counted.
  const waiting = queryClient.isMutating({
    predicate: (mutation) => !!mutation.options.meta?.keepOffline,
  })
  if (waiting === 1)
    return Promise.all(
      queryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
    )
}
