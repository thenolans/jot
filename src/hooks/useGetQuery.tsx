import { StringifiableRecord, stringify } from "query-string";
import { useQuery } from "react-query";
import http from "utils/http";

const defaultConfig = {
  retry: false,
  refetchOnWindowFocus: false,
};

export default function useGetQuery<TResult, TError = unknown>(
  url: string,
  query?: string | StringifiableRecord,
  config?: object
) {
  const queryKey = [url, typeof query === "object" ? stringify(query) : query]
    .filter(Boolean)
    .join("?");

  return useQuery<TResult, TError>(
    queryKey,
    async () => http.get(queryKey).then((data) => data.data),
    {
      ...defaultConfig,
      ...config,
    }
  );
}
