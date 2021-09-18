import Entry from "components/Entry";
import useEntries from "hooks/useEntries";
import useSearchParams, { asStringParam } from "hooks/useSearchParams";
import { Sticky, StickyContainer } from "react-sticky";

export default function Entries() {
  const [searchParams] = useSearchParams();
  const { sortedEntries } = useEntries();
  const dates = Object.keys(sortedEntries);
  const keywordFilter = asStringParam(searchParams.q);

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
                <Entry
                  highlightTerm={keywordFilter}
                  data={entry}
                  key={entry._id}
                />
              ))}
            </div>
          </StickyContainer>
        );
      })}
    </>
  );
}
