import { getLists } from "api/lists";
import Button from "components/core/Button";
import ContentLoader from "components/core/ContentLoader";
import Icon, { Plus } from "components/core/Icon";
import Layout from "components/core/Layout";
import PageTitle from "components/core/PageTitle";
import Tip from "components/core/Tip";
import useQueryWithUpdater from "hooks/useQueryWithUpdater";
import { useState } from "react";
import { List, QueryKeys } from "types";

import AddListModal from "../AddListModal";
import ListCard from "../ListCard";

export default function Lists() {
  const [isCreatingList, setIsCreatingList] = useState(false);
  const {
    data: lists = [],
    setData: setLists,
    isLoading,
    hasLoadedData,
  } = useQueryWithUpdater<List[]>([QueryKeys.LISTS_LIST], () => getLists());

  return (
    <Layout>
      <div className="space-y-8 lg:space-y-16">
        <div className="flex justify-between items-center">
          <PageTitle>Lists</PageTitle>
        </div>
        <div>
          {(() => {
            if (isLoading) {
              return <ContentLoader label="Fetching your lists..." />;
            } else if (!lists.length && hasLoadedData) {
              return (
                <Tip
                  title="You have not created any lists, yet."
                  description="Lists allow you to group items together and check them off"
                />
              );
            } else {
              return (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {lists.map((list) => {
                    return <ListCard list={list} key={list._id} />;
                  })}
                </div>
              );
            }
          })()}
        </div>
      </div>

      <Button
        className="u-floating-button"
        theme="rounded"
        aria-label="Create list"
        onClick={() => setIsCreatingList(true)}
      >
        <Icon size={32} icon={Plus} />
      </Button>

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
