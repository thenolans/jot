import dayjs from "dayjs";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { Entry as EntryType, SortedEntries } from "types";

type DialogOptions = "filter" | "create" | null;

type EntriesContextType = {
  sortedEntries: SortedEntries;
  activeDialog: DialogOptions;
  setActiveDialog: Dispatch<SetStateAction<DialogOptions>>;
};

const DATA: EntryType[] = [
  {
    _id: "1",
    title: "Hawaii: Kahlúa pork sliders",
    notes:
      "Lucas ipsum dolor sit amet mon mandalorians organa droid skywalker windu skywalker tatooine kenobi solo. Skywalker solo palpatine han skywalker. Ventress binks antilles yoda leia leia calamari coruscant.",
    createdAt: dayjs().subtract(4, "day").toISOString(),
    tags: ["Food & Wine Festival"],
  },
  {
    _id: "2",
    title: "Kona Brewing Company: IPA",
    notes:
      "Lucas ipsum dolor sit amet mon mandalorians organa droid skywalker windu skywalker tatooine kenobi solo. Skywalker solo palpatine han skywalker. Ventress binks antilles yoda leia leia calamari coruscant.",
    createdAt: dayjs().subtract(4, "day").toISOString(),
    tags: ["Food & Wine Festival", "Beer"],
  },
  {
    _id: "3",
    title: "Mexico: Chilaquiles",
    notes:
      "Lucas ipsum dolor sit amet mon mandalorians organa droid skywalker windu skywalker tatooine kenobi solo. Skywalker solo palpatine han skywalker. Ventress binks antilles yoda leia leia calamari coruscant.",
    createdAt: dayjs().subtract(5, "day").toISOString(),
    tags: ["Food & Wine Festival"],
  },
  {
    _id: "4",
    title: "Mexico: Chilaquiles",
    notes:
      "Lucas ipsum dolor sit amet mon mandalorians organa droid skywalker windu skywalker tatooine kenobi solo. Skywalker solo palpatine han skywalker. Ventress binks antilles yoda leia leia calamari coruscant.",
    createdAt: dayjs().subtract(5, "day").toISOString(),
    tags: ["Food & Wine Festival"],
  },
  {
    _id: "5",
    title: "Mexico: Chilaquiles",
    notes:
      "Lucas ipsum dolor sit amet mon mandalorians organa droid skywalker windu skywalker tatooine kenobi solo. Skywalker solo palpatine han skywalker. Ventress binks antilles yoda leia leia calamari coruscant.",
    createdAt: dayjs().subtract(5, "day").toISOString(),
    tags: ["Food & Wine Festival"],
  },
  {
    _id: "6",
    title: "Kona Brewing Company: IPA",
    notes:
      "Lucas ipsum dolor sit amet mon mandalorians organa droid skywalker windu skywalker tatooine kenobi solo. Skywalker solo palpatine han skywalker. Ventress binks antilles yoda leia leia calamari coruscant.",
    createdAt: dayjs().subtract(4, "day").toISOString(),
    tags: ["Food & Wine Festival", "Beer"],
  },
  {
    _id: "7",
    title: "Kona Brewing Company: IPA",
    notes:
      "Lucas ipsum dolor sit amet mon mandalorians organa droid skywalker windu skywalker tatooine kenobi solo. Skywalker solo palpatine han skywalker. Ventress binks antilles yoda leia leia calamari coruscant.",
    createdAt: dayjs().subtract(4, "day").toISOString(),
    tags: ["Food & Wine Festival", "Beer"],
  },
];

const EntriesContext = createContext<EntriesContextType>({
  sortedEntries: {},
  activeDialog: null,
  setActiveDialog() {},
});

export const EntriesProvider = ({ children }: { children: ReactNode }) => {
  const [activeDialog, setActiveDialog] = useState<DialogOptions>(null);
  const sortedEntriesByDate = DATA.reduce<SortedEntries>(
    (sortedEntries, currentEntry) => {
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
    },
    {}
  );

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
