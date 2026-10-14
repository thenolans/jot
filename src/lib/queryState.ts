import { errorMessage } from '@/lib/api'

type Query = {
  data: unknown
  error: Error | null
  isPending: boolean
  refetch: () => Promise<unknown>
}

/** A query's loading and error state and a way to retry, for a hook to spread into what it returns. */
export function queryState(query: Query) {
  return {
    /** Nothing has loaded yet. */
    isLoading: query.isPending,
    /** Why the data couldn't be loaded. A failed background refresh keeps the data already shown. */
    error: query.error && !query.data ? errorMessage(query.error) : null,
    reload: () => void query.refetch(),
  }
}
