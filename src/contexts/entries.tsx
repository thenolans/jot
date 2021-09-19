import Urls from "constants/urls";
import dayjs from "dayjs";
import useInfiniteQuery from "hooks/useInfiniteGetQuery";
import useNProgress from "hooks/useNProgress";
import useSearchParams from "hooks/useSearchParams";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import {
  DialogKeys,
  Entry as EntryType,
  PaginatedResponse,
  SortedEntries,
} from "types";

type EntriesContextType = {
  sortedEntries: SortedEntries;
  activeDialog: DialogKeys | null;
  setActiveDialog: Dispatch<SetStateAction<DialogKeys | null>>;
  isLoading: boolean;
  isFetching: boolean;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
};

const EntriesContext = createContext<EntriesContextType>({
  sortedEntries: {},
  activeDialog: null,
  setActiveDialog() {},
  isLoading: false,
  isFetching: false,
  hasNextPage: false,
  fetchNextPage() {},
});

export const EntriesProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams] = useSearchParams();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteQuery<PaginatedResponse<EntryType[]>>(
      Urls.api.entries,
      searchParams
    );
  const [activeDialog, setActiveDialog] = useState<DialogKeys | null>(null);
  const sortedEntriesByDate = data
    ? data.pages.reduce<SortedEntries>((sortedEntries, currentPage) => {
        const pageEntries = currentPage.data;
        pageEntries.forEach((entry) => {
          const formattedEntryDate = dayjs(entry.date).format("MMM D, YYYY");

          if (sortedEntries.hasOwnProperty(formattedEntryDate)) {
            const currentEntriesAtDate = sortedEntries[formattedEntryDate];
            sortedEntries[formattedEntryDate] = [
              ...currentEntriesAtDate,
              entry,
            ];
          } else {
            sortedEntries[formattedEntryDate] = [entry];
          }
        });
        return sortedEntries;
      }, {})
    : {};
  useNProgress(isFetching);

  return (
    <EntriesContext.Provider
      value={{
        sortedEntries: sortedEntriesByDate,
        activeDialog,
        setActiveDialog,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetching,
      }}
    >
      {children}
    </EntriesContext.Provider>
  );
};

export default EntriesContext;
