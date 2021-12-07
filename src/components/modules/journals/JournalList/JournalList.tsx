import Button from "components/core/Button";
import ContentLoader from "components/core/ContentLoader";
import Icon, { Plus } from "components/core/Icon";
import Layout from "components/core/Layout";
import PageTitle from "components/core/PageTitle";
import Tip from "components/core/Tip";
import Urls from "constants/urls";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Journal, QueryKeys } from "types";
import http from "utils/http";

import CreateJournalModal from "../CreateJournalModal";
import JournalLink from "../JournalLink";

function fetchJournals(): Promise<Journal[]> {
  return http.get(Urls.api["journals:list"]).then((res) => res.data.data);
}

export default function JournalList() {
  const [isCreatingJournal, setIsCreatingJournal] = useState(false);
  const { data = [], isLoading } = useQuery(
    QueryKeys.JOURNAL_LIST,
    fetchJournals
  );
  const [journals, setJournals] = useState<Journal[]>(data);

  useEffect(() => {
    if (data.length) {
      setJournals(data);
    }
  }, [data]);

  return (
    <Layout>
      <div className="space-y-8 lg:space-y-16">
        <div className="flex justify-between items-center">
          <PageTitle>Journals</PageTitle>
        </div>
        {(() => {
          if (isLoading) {
            return <ContentLoader label="Fetching your journals..." />;
          } else if (!journals.length) {
            return (
              <Tip
                title="You have not created any journals, yet."
                description="Journals allow you to log entries that can be searched and
                refined to quickly find information you've saved over time"
              />
            );
          } else {
            return (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-8">
                {journals.map(({ _id, name }) => {
                  return <JournalLink id={_id} key={_id} name={name} />;
                })}
              </div>
            );
          }
        })()}
      </div>

      <Button
        className="u-floating-button"
        theme="rounded"
        aria-label="Create journal"
        onClick={() => setIsCreatingJournal(true)}
      >
        <Icon size={32} icon={Plus} />
      </Button>

      <CreateJournalModal
        isOpen={isCreatingJournal}
        onClose={(newJournal?: Journal) => {
          if (newJournal) {
            setJournals(
              [newJournal, ...journals].sort((a, b) =>
                a.name > b.name ? 1 : -1
              )
            );
          }

          setIsCreatingJournal(false);
        }}
      />
    </Layout>
  );
}
