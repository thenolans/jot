import Urls from "constants/urls";
import dayjs from "dayjs";
import useInfiniteQuery from "hooks/useInfiniteGetQuery";
import useNProgress from "hooks/useNProgress";
import useSearchParams from "hooks/useSearchParams";
import { reverse } from "named-urls";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import {
  DialogKeys,
  Entry,
  Entry as EntryType,
  EntryFormData,
  PaginatedResponse,
  SortedEntries,
} from "types";
import http from "utils/http";

type EntriesContextType = {
  sortedEntries: SortedEntries;
  activeDialog: DialogKeys | null;
  setActiveDialog: Dispatch<SetStateAction<DialogKeys | null>>;
  isLoading: boolean;
  isFetching: boolean;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
  addEntry: (entryData: Partial<Omit<Entry, "_id">>) => void;
  saveEntry: (entryId: string, entryData: EntryFormData) => void;
  deleteEntry: (entryId: string) => void;
  entryToEdit: Entry | null;
  setEntryToEdit: Dispatch<SetStateAction<Entry | null>>;
};

const EntriesContext = createContext<EntriesContextType>({
  sortedEntries: {},
  activeDialog: null,
  setActiveDialog() {},
  isLoading: false,
  isFetching: false,
  hasNextPage: false,
  fetchNextPage() {},
  addEntry() {},
  saveEntry() {},
  deleteEntry() {},
  entryToEdit: null,
  setEntryToEdit() {},
});

export const EntriesProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams] = useSearchParams();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetching, refetch } =
    useInfiniteQuery<PaginatedResponse<EntryType[]>>(
      Urls.api.entries,
      searchParams
    );
  const [activeDialog, setActiveDialog] = useState<DialogKeys | null>(null);
  const [entryToEdit, setEntryToEdit] = useState<Entry | null>(null);
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

  async function addEntry(data: Partial<Omit<Entry, "_id">>) {
    const newEntry = await http.post(Urls.api.entries, data);

    refetch();

    return newEntry;
  }

  async function saveEntry(entryId: string, entryData: EntryFormData) {
    await http.patch(reverse(Urls.api.entry, { id: entryId }), entryData);

    refetch();
  }

  async function deleteEntry(entryId: string) {
    await http.delete(reverse(Urls.api.entry, { id: entryId }));

    refetch();
  }

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
        addEntry,
        deleteEntry,
        entryToEdit,
        setEntryToEdit,
        saveEntry,
      }}
    >
      {children}
    </EntriesContext.Provider>
  );
};

export default EntriesContext;
