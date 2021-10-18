import Button from "components/Button";
import Icon from "components/Icon";
import Input from "components/Input";
import JournalEntry from "components/JournalEntry";
import Layout from "components/Layout";
import PageTitle from "components/PageTitle";
import TagSelect from "components/TagSelect";
import Tip from "components/Tip";
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
import { useLocation, useRouteMatch } from "react-router";
import { PaginatedEntries } from "types";

import LogEntryModal from "./LogEntryModal";

type Location = {
  state: {
    name?: string;
  };
};

export default function JournalList() {
  const location = useLocation();
  const match = useRouteMatch<{ id: string }>();
  const journalId = match.params.id;
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoggingEntry, setIsLoggingEntry] = useState(false);
  const [searchTerm, setSearchTerm] = useState(
    asStringParam(searchParams.q) || ""
  );
  const selectedTags = asStringArrayParam(searchParams.tag);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { data, isLoading, isFetching, refetch } =
    useInfiniteGetQuery<PaginatedEntries>(
      reverse(Urls.api["journal:entries"], { id: journalId }),
      { q: debouncedSearchTerm, tag: selectedTags }
    );

  const passedName = (location as Location).state?.name;
  const displayName = passedName || data?.pages[0].meta.journal.name;
  const entries = // @ts-expect-error
    data?.pages.reduce((entries, page) => {
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
    <TagProvider>
      <Layout>
        <div className="space-y-16">
          <PageTitle>{displayName}</PageTitle>
          {displayName && (
            <div className="grid grid-cols-7 gap-4">
              <div className="col-span-4">
                <Input
                  placeholder="Search journal..."
                  className="flex-grow"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <TagSelect
                  placeholder="Filter by tag..."
                  inputId=""
                  onChange={(selectedTags) =>
                    setSearchParams({
                      tag: selectedTags,
                    })
                  }
                  value={selectedTags}
                />
              </div>
              <Button
                onClick={() => setIsLoggingEntry(true)}
                className="flex-shrink-0"
              >
                Log entry
              </Button>
            </div>
          )}
          {(() => {
            if (isLoading) {
              return (
                <div className="text-center space-y-4 text-primary-600">
                  <Icon size="fa-3x" variant="fa-circle-o-notch" spin />
                  <div>Fetching journal details...</div>
                </div>
              );
            } else if (
              // @ts-expect-error
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
              // @ts-expect-error
            } else if (!entries.length) {
              return (
                <Tip
                  title="No entries match your filters!"
                  description="We could not find any entries that match your search term or tags. Try searching by a new keyword or adjusting the tags to refine results."
                />
              );
            } else {
              return (
                <div className="bg-primary-100 rounded-r-3xl overflow-hidden">
                  {
                    // @ts-expect-error
                    entries?.map((entry) => (
                      <JournalEntry
                        refetch={refetch}
                        key={entry._id}
                        entry={entry}
                      />
                    ))
                  }
                </div>
              );
            }
          })()}
        </div>
      </Layout>
      <LogEntryModal
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
