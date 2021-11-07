import {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  QueryFunction,
  QueryKey,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from "react-query";
import updateQueryCacheIfExists from "utils/updateQueryCacheIfExists";

type Result<T> = Omit<UseQueryResult, "data"> & {
  data: T | undefined;
  setData: Dispatch<SetStateAction<T | undefined>>;
  hasLoadedData: boolean;
};

export default function useQueryWithUpdater<T>(
  queryKey: QueryKey,
  queryFn: QueryFunction<T>,
  options?: UseQueryOptions<T>
): Result<T> {
  const queryClient = useQueryClient();
  const updateCacheOnUnmount = useRef(() => {});
  const query = useQuery<T>(queryKey, queryFn, options);
  const [hasLoadedData, setHasLoadedData] = useState(false);
  const [data, setData] = useState<T | undefined>();

  updateCacheOnUnmount.current = () => {
    updateQueryCacheIfExists(queryClient, queryKey, data);
  };

  useLayoutEffect(() => {
    if (query.data) {
      setData(query.data);
      setHasLoadedData(true);
    }
  }, [query.data]);

  useEffect(() => {
    return () => updateCacheOnUnmount.current();
  }, []);

  return {
    ...query,
    hasLoadedData: hasLoadedData && !query.isLoading,
    isLoading: !hasLoadedData || query.isLoading,
    data,
    setData,
  };
}
