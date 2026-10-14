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
