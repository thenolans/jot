import { getLists } from "api/lists";
import Button from "components/core/Button";
import Icon from "components/core/Icon";
import Layout from "components/core/Layout";
import PageTitle from "components/core/PageTitle";
import Tip from "components/core/Tip";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { List, QueryKeys } from "types";
import updateQueryCacheIfExists from "utils/updateQueryCacheIfExists";

import AddListModal from "../AddListModal";
import ListCard from "../ListCard";

export default function Lists() {
  const queryClient = useQueryClient();
  const [isCreatingList, setIsCreatingList] = useState(false);
  const { data = [], isLoading } = useQuery([QueryKeys.LISTS_LIST], () =>
    getLists()
  );
  const [lists, setLists] = useState<List[]>(data);

  useEffect(() => {
    if (data.length) {
      setLists(data);
    }
  }, [data]);

  useEffect(() => {
    updateQueryCacheIfExists(queryClient, QueryKeys.LISTS_LIST, lists);
  }, [lists, queryClient]);

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        onAdd={(newList) => {
          setLists(
            [newList, ...lists].sort((a, b) => (a.name > b.name ? 1 : -1))
          );
        }}
        onClose={() => setIsCreatingList(false)}
      />
    </Layout>
  );
}
