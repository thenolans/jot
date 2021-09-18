import Urls from "constants/urls";
import dayjs from "dayjs";
import useGetQuery from "hooks/useGetQuery";
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
};

const EntriesContext = createContext<EntriesContextType>({
  sortedEntries: {},
  activeDialog: null,
  setActiveDialog() {},
});

export const EntriesProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams] = useSearchParams();
  const { data, isLoading } = useGetQuery<PaginatedResponse<EntryType[]>>(
    Urls.api.entries,
    searchParams
  );
  console.log(data);
  const [activeDialog, setActiveDialog] = useState<DialogKeys | null>(null);
  const sortedEntriesByDate = data
    ? data.data.reduce<SortedEntries>((sortedEntries, currentEntry) => {
        const formattedEntryDate = dayjs(currentEntry.date).format(
          "MMM D, YYYY"
        );

        if (sortedEntries.hasOwnProperty(formattedEntryDate)) {
          const currentEntriesAtDate = sortedEntries[formattedEntryDate];
          sortedEntries[formattedEntryDate] = [
            ...currentEntriesAtDate,
            currentEntry,
          ];
        } else {
          sortedEntries[formattedEntryDate] = [currentEntry];
        }
        return sortedEntries;
      }, {})
    : {};

  return (
    <EntriesContext.Provider
      value={{
        sortedEntries: sortedEntriesByDate,
        activeDialog,
        setActiveDialog,
      }}
    >
      {children}
    </EntriesContext.Provider>
  );
};

export default EntriesContext;
