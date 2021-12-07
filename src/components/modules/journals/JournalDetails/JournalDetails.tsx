import Button from "components/core/Button";
import ConfirmModal from "components/core/ConfirmModal";
import ContentLoader from "components/core/ContentLoader";
import Icon, { Gear, OpeningTag, Plus, Trash } from "components/core/Icon";
import Input from "components/core/Input";
import Layout from "components/core/Layout";
import Link from "components/core/Link";
import Loader from "components/core/Loader";
import PageTitle from "components/core/PageTitle";
import TagSelect from "components/core/TagSelect";
import Tip from "components/core/Tip";
import Tooltip from "components/core/Tooltip";
import Urls from "constants/urls";
import { TagProvider } from "contexts/tags";
import dayjs from "dayjs";
import useDebounce from "hooks/useDebounce";
import useInfiniteGetQuery from "hooks/useInfiniteGetQuery";
import useNProgress from "hooks/useNProgress";
import useSearchParams, {
  asStringArrayParam,
  asStringParam,
} from "hooks/useSearchParams";
import { reverse } from "named-urls";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useQueryClient } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { PaginatedEntries, QueryKeys, SortedEntries, TagTypes } from "types";
import http from "utils/http";

import EditJournalModal from "../EditJournalModal";
import JournalEntry from "../JournalEntry";
import LogJournalEntryModal from "../LogJournalEntryModal";

type Location = {
  state: {
    name?: string;
  };
};

const initialData: SortedEntries = {
  dates: [],
  entriesByDate: {},
  count: 0,
};

export default function JournalList() {
  const history = useHistory();
  const location = useLocation();
  const queryClient = useQueryClient();
  const match = useRouteMatch<{ id: string }>();
  const journalId = match.params.id;
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditingJournal, setIsEditingJournal] = useState(false);
  const [isConfirimingDelete, setIsConfirmingDelete] = useState(false);
  const [isLoggingEntry, setIsLoggingEntry] = useState(false);
  const [searchTerm, setSearchTerm] = useState(
    asStringParam(searchParams.q) || ""
  );
  const selectedTags = asStringArrayParam(searchParams.tag);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { data, isLoading, isFetching, refetch, hasNextPage, fetchNextPage } =
    useInfiniteGetQuery<PaginatedEntries>(
      reverse(Urls.api["journal:entries"], { id: journalId }),
      { q: debouncedSearchTerm, tag: selectedTags }
    );
  const passedName = (location as Location).state?.name;
  const [displayName, setDisplayName] = useState(
    passedName || data?.pages[0].meta.journal.name || ""
  );

  const sortedEntries =
    data?.pages.reduce<SortedEntries>(
      (sortedEntriesByDate, page) => {
        page.data.forEach((entry) => {
          const formattedEntryDate = dayjs(entry.date).format("MMM D, YYYY");

          // If the date hasn't been included, yet, include it
          // The entries are sorted on server, so there should be no need to sort
          // here as they're pushed in order
          if (!sortedEntriesByDate.dates.includes(formattedEntryDate)) {
            sortedEntriesByDate.dates = [
              ...sortedEntriesByDate.dates,
              formattedEntryDate,
            ];
            sortedEntriesByDate.entriesByDate[formattedEntryDate] = [];
          }

          sortedEntriesByDate.entriesByDate[formattedEntryDate].push(entry);
          sortedEntriesByDate.count = sortedEntriesByDate.count + 1;
        });

        return sortedEntriesByDate;
      },
      {
        dates: [],
        entriesByDate: {},
        count: 0,
      }
    ) || initialData;

  useNProgress(isFetching);

  useEffect(() => {
    setSearchParams({ q: debouncedSearchTerm || undefined });
  }, [debouncedSearchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  async function deleteJournal() {
    if (window.confirm("Are you sure you want to delete this journal?")) {
      await http.delete(
        reverse(Urls.api["journal:details"], {
          id: journalId,
        })
      );

      queryClient.removeQueries(QueryKeys.JOURNAL_LIST);
      history.push(Urls.routes["journal:list"]);
    }
  }

  if (!isLoading && !data?.pages.length) {
    return <Layout>Not found</Layout>;
  }

  return (
    <TagProvider type={TagTypes.JOURNAL} typeId={journalId}>
      <Layout>
        {(scrollContainerRef) => (
          <div className="space-y-8 lg:space-y-16 pb-24 lg:pb-0">
            {!isLoading && (
              <div className="flex items-center justify-between">
                <Link theme="muted" to={Urls.routes["journal:list"]}>
                  <Icon icon={OpeningTag} />
                  <span>Back to all journals</span>
                </Link>
                <div className="space-x-4">
                  <Tooltip title="Edit journal settings">
                    <Button
                      onClick={() => setIsEditingJournal(true)}
                      theme="link-muted"
                      aria-label="Edit journal settings"
                    >
                      <Icon icon={Gear} />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Delete journal">
                    <Button
                      onClick={() => setIsConfirmingDelete(true)}
                      theme="link-danger"
                      aria-label="Delete journal"
                    >
                      <Icon icon={Trash} />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <PageTitle>{displayName}</PageTitle>
              <div className="right-3 bottom-24 fixed md:static"></div>
            </div>
            {displayName && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Search journal..."
                  className="flex-grow"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <TagSelect
                  placeholder="Tags..."
                  inputId=""
                  onChange={(selectedTags) =>
                    setSearchParams({
                      tag: selectedTags,
                    })
                  }
                  value={selectedTags}
                />
              </div>
            )}
            {(() => {
              if (isLoading) {
                return <ContentLoader label="Fetching journal details..." />;
              } else if (
                !sortedEntries.count &&
                !searchParams.q &&
                !searchParams.tag
              ) {
                return (
                  <Tip
                    title="You have not logged any entries, yet."
                    description="Entries are the individual pieces that make up a journal. You can search them by keyword or by tag after you create some!"
                  />
                );
              } else if (!sortedEntries.count) {
                return (
                  <Tip
                    title="No entries match your filters!"
                    description="We could not find any entries that match your search term or tags. Try searching by a new keyword or adjusting the tags to refine results."
                  />
                );
              } else if (scrollContainerRef) {
                return (
                  <InfiniteScroll
                    scrollableTarget={
                      // TODO: Make this dynamic so it doesn't require a page reload,
                      // but I don't think react-infinite-scroll-component supports
                      // changing this prop after mount
                      window.innerWidth >= 768
                        ? scrollContainerRef.current
                        : undefined
                    }
                    className="space-y-8"
                    dataLength={sortedEntries.count}
                    next={fetchNextPage}
                    hasMore={Boolean(hasNextPage)}
                    loader={
                      <div className="text-center p-4 text-primary-500 space-y-8">
                        <Loader />
                      </div>
                    }
                  >
                    {sortedEntries.dates.map((date) => {
                      const entries = sortedEntries.entriesByDate[date];
                      return (
                        <div key={date}>
                          <div className="bg-gray-50 py-2 text-primary-300 sticky top-0 uppercase text-sm">
                            {date}
                          </div>
                          <div className="space-y-4">
                            {entries.map((entry) => {
                              return (
                                <JournalEntry
                                  refetch={refetch}
                                  key={entry._id}
                                  entry={entry}
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </InfiniteScroll>
                );
              }
            })()}
          </div>
        )}
      </Layout>

      <Button
        className="u-floating-button"
        onClick={() => setIsLoggingEntry(true)}
        aria-label="Log entry"
        theme="rounded"
      >
        <Icon icon={Plus} />
      </Button>

      <EditJournalModal
        journal={{
          _id: journalId,
          name: displayName,
        }}
        isOpen={isEditingJournal}
        onClose={(updatedJournal) => {
          if (updatedJournal) {
            setDisplayName(updatedJournal.name);
            refetch();
            history.replace({ state: { name: updatedJournal.name } });
          }

          setIsEditingJournal(false);
        }}
      />
      <LogJournalEntryModal
        journalId={journalId}
        isOpen={isLoggingEntry}
        onClose={(shouldRefetch) => {
          if (shouldRefetch) {
            refetch();
          }

          setIsLoggingEntry(false);
        }}
      />
      <ConfirmModal
        ariaLabel="Confirm journal delete"
        description="This action will delete this journal and all of its associated entries and tags. This action cannot be undone."
        isOpen={isConfirimingDelete}
        onClose={() => setIsConfirmingDelete(false)}
        onConfirm={() => deleteJournal()}
        title="Are you sure you want to delete this journal?"
        typeConfirm={displayName}
      />
    </TagProvider>
  );
}
