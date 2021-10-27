import Button from "components/core/Button";
import Icon from "components/core/Icon";
import Layout from "components/core/Layout";
import PageTitle from "components/core/PageTitle";
import Tip from "components/core/Tip";
import Urls from "constants/urls";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { List } from "types";
import http from "utils/http";

import AddListModal from "../AddListModal";
import ListCard from "../ListCard";

function fetchLists(): Promise<List[]> {
  return http.get(Urls.api["lists:list"]).then((res) => res.data.data);
}

export default function Lists() {
  const [isCreatingList, setIsCreatingList] = useState(false);
  const { data = [], isLoading } = useQuery(["lists"], () => fetchLists());
  const [lists, setLists] = useState<List[]>(data);

  useEffect(() => {
    if (data.length) {
      setLists(data);
    }
  }, [data]);

  return (
    <Layout>
      <div className="space-y-8 lg:space-y-16">
        <div className="flex justify-between items-center">
          <PageTitle>Lists</PageTitle>
          <Button onClick={() => setIsCreatingList(true)}>Create list</Button>
        </div>
        <div>
          {(() => {
            if (isLoading) {
              return (
                <div className="text-center space-y-4 text-primary-600">
                  <Icon size="fa-3x" variant="fa-circle-o-notch" spin />
                  <div>Fetching your lists...</div>
                </div>
              );
            } else if (!lists.length) {
              return (
                <Tip
                  title="You have not created any lists, yet."
                  description="Lists allow you to group items together and check them off"
                />
              );
            } else {
              return (
                <div className="grid grid-cols-3 gap-4">
                  {lists.map((list) => {
                    return <ListCard list={list} key={list._id} />;
                  })}
                </div>
              );
            }
          })()}
        </div>
      </div>

      <AddListModal
        isOpen={isCreatingList}
        onClose={(newList?: List) => {
          if (newList) {
            setLists(
              [newList, ...lists].sort((a, b) => (a.name > b.name ? 1 : -1))
            );
          }

          setIsCreatingList(false);
        }}
      />
    </Layout>
  );
}
