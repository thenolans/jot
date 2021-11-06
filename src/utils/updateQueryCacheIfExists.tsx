import { QueryClient, QueryKey } from "react-query";

export default function updateQueryCacheIfExists(
  queryClient: QueryClient,
  queryKey: QueryKey,
  updater: ((oldData: any) => any) | any
) {
  // Check if it exists
  const cachedData = queryClient.getQueryData(queryKey);

  if (cachedData) {
    queryClient.setQueryData(queryKey, updater);
  }
}
