import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { defaultShouldDehydrateMutation } from '@tanstack/react-query'
import type { PersistQueryClientProviderProps } from '@tanstack/react-query-persist-client'
import { del, get, set } from 'idb-keyval'

import { queryClient } from '@/app/queryClient'
import { isOfflineChange, OFFLINE_MAX_AGE } from '@/lib/offlineQuery'

/**
 * Bump when the shape of cached data changes, so data saved by an older version of the app is dropped
 * rather than shown.
 */
const CACHE_VERSION = '7'

/**
 * Saves the queries and changes marked `keepOffline` to IndexedDB, and restores them when the app
 * opens, so they're there offline. Signing in or out clears them from the cache, which clears them here.
 */
export const persistOptions: PersistQueryClientProviderProps['persistOptions'] =
  {
    persister: createAsyncStoragePersister({
      storage: { getItem: get, setItem: set, removeItem: del },
      key: 'jot.queryCache',
    }),
    maxAge: OFFLINE_MAX_AGE,
    buster: CACHE_VERSION,
    dehydrateOptions: {
      // Unlike the default, this keeps data whose latest refresh failed, as every refresh does offline.
      shouldDehydrateQuery: (query) =>
        query.state.data !== undefined && !!query.meta?.keepOffline,
      shouldDehydrateMutation: (mutation) =>
        defaultShouldDehydrateMutation(mutation) && isOfflineChange(mutation),
    },
  }

/** Once the cache is restored, sends changes made offline, then refreshes what was restored. */
export async function syncRestoredCache() {
  await queryClient.resumePausedMutations()
  await queryClient.invalidateQueries()
}
