import { useQuery } from '@tanstack/react-query'

import { noteQueries } from './queries'

/**
 * Keeps a copy of every note on the device while the signed-in app is open, refreshed now and then, so
 * notes can be listed, searched and opened offline. Nothing re-renders as it changes.
 */
export function useKeepNotesOffline() {
  useQuery({ ...noteQueries.offlineCopy(), notifyOnChangeProps: [] })
}
