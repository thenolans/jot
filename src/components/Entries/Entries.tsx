import Entry from "components/Entry";
import useEntries from "hooks/useEntries";
import { Sticky, StickyContainer } from "react-sticky";

export default function Entries() {
  const { sortedEntries } = useEntries();
  const dates = Object.keys(sortedEntries);

  return (
    <>
      {dates.map((date) => {
        const entriesForDate = sortedEntries[date];
        return (
          <StickyContainer key={date}>
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
