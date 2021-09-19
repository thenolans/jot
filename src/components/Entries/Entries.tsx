import Button from "components/Button";
import Entry from "components/Entry";
import dayjs from "dayjs";
import useEntries from "hooks/useEntries";
import useSearchParams, { asStringParam } from "hooks/useSearchParams";
import { Sticky, StickyContainer } from "react-sticky";
import { DialogKeys } from "types";

export default function Entries() {
  const [searchParams] = useSearchParams();
  const {
    sortedEntries,
    setActiveDialog,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useEntries();
  const dates = Object.keys(sortedEntries);
  const keywordFilter = asStringParam(searchParams.q);

  if (isLoading) {
    return (
      <div className="text-center space-y-4">
        <i className="fa fa-circle-o-notch fa-spin fa-2x text-gray-300" />
        <div className="text-gray-500">Fetching entries</div>
      </div>
    );
  }

  if (!Object.keys(sortedEntries).length && !Object.keys(searchParams).length) {
    return (
      <div className="text-center space-y-6">
        <i className="fa fa-book fa-3x text-gray-400" />
        <div className="text-gray-500 text-xl">
          You have not logged any entries, yet
        </div>
        <Button onClick={() => setActiveDialog(DialogKeys.CREATE)}>
          Add entry
        </Button>
      </div>
    );
  }

  if (!Object.keys(sortedEntries).length && Object.keys(searchParams).length) {
    return (
      <div className="text-center space-y-6">
        <i className="fa fa-book fa-3x text-gray-400" />
        <div className="text-gray-500 text-xl">
          No results match the applied filters, try adjusting them!
        </div>
        <Button onClick={() => setActiveDialog(DialogKeys.FILTER)}>
          Change filters
        </Button>
      </div>
    );
  }

  return (
    <>
      {dates.map((date) => {
        const entriesForDate = sortedEntries[date];
        return (
          <StickyContainer key={date}>
            <Sticky>
              {({ style }) => (
                <time
                  dateTime={dayjs(date).format("YYYY-MM-DD")}
                  style={style}
                  className="p-2 bg-gray-50 uppercase text-sm text-gray-400"
                >
                  {date}
                </time>
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
      {isFetching && (
        <div className="text-center">
          <i className="fa fa-circle-o-notch fa-spin fa-2x text-gray-300" />
        </div>
      )}
      {hasNextPage && !isFetching && (
        <div className="text-center">
          <Button onClick={() => fetchNextPage()} theme="mutedLink">
            <i className="mr-4 fa fa-long-arrow-down text-gray-300" />
            Load more entries
            <i className="ml-4 fa fa-long-arrow-down text-gray-300" />
          </Button>
        </div>
      )}
    </>
  );
}
