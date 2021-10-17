import { StringifiableRecord, stringify, stringifyUrl } from "query-string";
import { QueryObserverOptions, useInfiniteQuery } from "react-query";
import http from "utils/http";

const fetchData = async (
  url: string,
  query: StringifiableRecord | undefined,
  page: number
) => {
  const next = stringifyUrl({
    url,
    query: {
      ...query,
      page,
    },
  });
  return http.get(next).then((data) => data.data);
};

const defaultConfig: QueryObserverOptions<any> = {
  getNextPageParam: (lastPage) => lastPage.meta.nextPage,
};

export default function useInfiniteGetQuery<TResult>(
  url: string,
  query?: StringifiableRecord
) {
  const queryKey = [url, typeof query === "object" ? stringify(query) : query]
    .filter(Boolean)
    .join("?");

  return useInfiniteQuery<TResult>(
    queryKey,
    ({ pageParam = 1 }) => fetchData(url, query, pageParam),
    defaultConfig
  );
}
