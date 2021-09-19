import Button from "components/Button";
import EmptyState from "components/EmptyState";
import Entry from "components/Entry";
import Icon from "components/Icon";
import SROnly from "components/SROnly";
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
        <Icon
          className="text-gray-300"
          variant="fa-circle-o-notch"
          size="fa-2x"
          spin
        />
        <div className="text-gray-500">Fetching entries</div>
      </div>
    );
  }

  if (!Object.keys(sortedEntries).length && !Object.keys(searchParams).length) {
    return (
      <EmptyState text="You have not logged any entries, yet">
        <Button onClick={() => setActiveDialog(DialogKeys.CREATE)}>
          Add entry
        </Button>
      </EmptyState>
    );
  }

  if (!Object.keys(sortedEntries).length && Object.keys(searchParams).length) {
    return (
      <EmptyState text="No results match the applied filters, try adjusting them!">
        <Button onClick={() => setActiveDialog(DialogKeys.FILTER)}>
          Change filters
        </Button>
      </EmptyState>
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
          <Icon
            className="text-gray-300"
            variant="fa-circle-o-notch"
            size="2x"
            spin
          />
          <SROnly>Loading more entries...</SROnly>
        </div>
      )}
      {hasNextPage && !isFetching && (
        <div className="text-center mb-8">
          <Button onClick={() => fetchNextPage()} theme="link--muted">
            <Icon className="text-gray-300" variant="fa-long-arrow-down" />
            <span>Load more entries</span>
            <Icon className="text-gray-300" variant="fa-long-arrow-down" />
          </Button>
        </div>
      )}
    </>
  );
}
