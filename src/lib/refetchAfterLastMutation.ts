import type { MutationKey, QueryClient, QueryKey } from '@tanstack/react-query'

/**
 * For a mutation's `onSettled`: refetches `queryKey` once no other mutation under `mutationKey` is still
 * running, so a run of quick changes refetches once, after the last, which also undoes any that failed.
 */
export function refetchAfterLastMutation(
  queryClient: QueryClient,
  mutationKey: MutationKey,
  queryKey: QueryKey,
) {
  // The settling mutation is still counted.
  if (queryClient.isMutating({ mutationKey }) === 1)
    return queryClient.invalidateQueries({ queryKey })
}
