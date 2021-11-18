import Button from "components/core/Button";
import Icon, { Gear } from "components/core/Icon";
import Input from "components/core/Input";
import Layout from "components/core/Layout";
import Loader from "components/core/Loader";
import PageTitle from "components/core/PageTitle";
import TagSelect from "components/core/TagSelect";
import Tip from "components/core/Tip";
import Urls from "constants/urls";
import { TagProvider } from "contexts/tags";
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
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { Entry, PaginatedEntries, TagTypes } from "types";

import EditJournalModal from "../EditJournalModal";
import JournalEntry from "../JournalEntry";
import LogJournalEntryModal from "../LogJournalEntryModal";

type Location = {
  state: {
    name?: string;
  };
};

export default function JournalList() {
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch<{ id: string }>();
  const journalId = match.params.id;
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditingJournal, setIsEditingJournal] = useState(false);
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
  const entries =
    data?.pages.reduce<Entry[]>((entries, page) => {
      return [...entries, ...page.data];
    }, []) || [];

  useNProgress(isFetching);

  useEffect(() => {
    setSearchParams({ q: debouncedSearchTerm || undefined });
  }, [debouncedSearchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isLoading && !data?.pages.length) {
    return <Layout>Not found</Layout>;
  }

  return (
    <TagProvider type={TagTypes.JOURNAL} typeId={journalId}>
      <Layout>
        {(scrollContainerRef) => (
          <div className="space-y-8 lg:space-y-16 pb-6 lg:pb-0">
            <div className="flex items-center justify-between">
              <PageTitle>{displayName}</PageTitle>
              <Button
                onClick={() => setIsEditingJournal(true)}
                className="ml-auto mr-4"
                theme="link--primary"
                aria-label="Edit journal"
              >
                <Icon size={32} icon={Gear} />
              </Button>
              <Button onClick={() => setIsLoggingEntry(true)}>Log entry</Button>
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
                return (
                  <div className="text-center space-y-4 text-primary-600">
                    <Loader size={48} />
                    <div>Fetching journal details...</div>
                  </div>
                );
              } else if (
                !entries.length &&
                !searchParams.q &&
                !searchParams.tag
              ) {
                return (
                  <Tip
                    title="You have not logged any entries, yet."
                    description="Entries are the individual pieces that make up a journal. You can search them by keyword or by tag after you create some!"
                  />
                );
              } else if (!entries.length) {
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
                    className="bg-primary-100 rounded-r-3xl overflow-hidden"
                    dataLength={entries.length}
                    next={fetchNextPage}
                    hasMore={Boolean(hasNextPage)}
                    loader={
                      <div className="text-center space-y-4 text-primary-600">
                        <Loader />
                      </div>
                    }
                  >
                    {entries.map((entry) => (
                      <JournalEntry
                        refetch={refetch}
                        key={entry._id}
                        entry={entry}
                      />
                    ))}
                  </InfiniteScroll>
                );
              }
            })()}
          </div>
        )}
      </Layout>

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
    </TagProvider>
  );
}
