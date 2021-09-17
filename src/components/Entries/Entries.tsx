import Entry from "components/Entry";
import dayjs from "dayjs";
import { Sticky, StickyContainer } from "react-sticky";
import { Entry as EntryType } from "types";

type SortedEntries = {
  [formattedDate: string]: EntryType[];
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

export default function Entries() {
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
  const dates = Object.keys(sortedEntriesByDate);

  return (
    <>
      {dates.map((date) => {
        const entriesForDate = sortedEntriesByDate[date];
        return (
          <StickyContainer>
            <Sticky>
              {({ style }) => (
                <div
                  style={style}
                  className="p-2 bg-gray-50 uppercase text-sm text-gray-400"
                >
                  {date}
                </div>
              )}
            </Sticky>
            <div className="space-y-4 px-2 pt-2 pb-8">
              {entriesForDate.map((entry) => (
                <Entry data={entry} key={entry._id} />
              ))}
            </div>
          </StickyContainer>
        );
      })}
    </>
  );
}
