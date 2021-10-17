import Button from "components/Button";
import Icon from "components/Icon";
import JournalLink from "components/JournalLink";
import Layout from "components/Layout";
import PageTitle from "components/PageTitle";
import Tip from "components/Tip";
import Urls from "constants/urls";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Journal } from "types";
import http from "utils/http";

import CreateJournalModal from "./CreateJournalModal";

function fetchJournals(): Promise<Journal[]> {
  return http.get(Urls.api["journals:list"]).then((res) => res.data.data);
}

export default function JournalList() {
  const [isCreatingJournal, setIsCreatingJournal] = useState(false);
  const [journals, setJournals] = useState<Journal[]>([]);
  const { data = [], isLoading: isFetching } = useQuery(
    ["journals"],
    () => fetchJournals(),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (data.length) {
      setJournals(data);
    }
  }, [data]);

  return (
    <Layout>
      <div className="space-y-16">
        <div className="flex justify-between items-center">
          <PageTitle>Journals</PageTitle>
          <Button onClick={() => setIsCreatingJournal(true)}>
            Create journal
          </Button>
        </div>
        {(() => {
          if (isFetching) {
            return (
              <div className="text-center space-y-4 text-primary-600">
                <Icon size="fa-3x" variant="fa-circle-o-notch" spin />
                <div>Fetching your journals...</div>
              </div>
            );
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
              <div className="grid grid-cols-4 gap-16">
                {journals.map(({ _id, name }) => {
                  console.log(_id);
                  return <JournalLink id={_id} key={_id} name={name} />;
                })}
              </div>
            );
          }
        })()}
      </div>
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
