import { useSyncExternalStore } from 'react'

import { connectivity } from '@/lib/connectivity'

/** Whether the API can be reached (see `connectivity`). */
export function useIsOnline() {
  return useSyncExternalStore(connectivity.subscribe, connectivity.isOnline)
}
