import Urls from "constants/urls";
import dayjs from "dayjs";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { useQuery } from "react-query";
import {
  DialogKeys,
  Entry as EntryType,
  PaginatedResponse,
  SortedEntries,
} from "types";
import http from "utils/http";

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

function fetchEntries(): Promise<PaginatedResponse<EntryType[]>> {
  return http.get(Urls.api.entries).then((res) => res.data);
}

export const EntriesProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading } = useQuery(["entries"], () => fetchEntries(), {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const [activeDialog, setActiveDialog] = useState<DialogKeys | null>(null);
  const sortedEntriesByDate = data
    ? data.data.reduce<SortedEntries>((sortedEntries, currentEntry) => {
        const formattedEntryDate = dayjs(currentEntry.createdAt).format(
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
