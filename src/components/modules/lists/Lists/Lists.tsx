import { getLists } from "api/lists";
import Button from "components/core/Button";
import ContentLoader from "components/core/ContentLoader";
import Icon, { Plus } from "components/core/Icon";
import { SearchInput } from "components/core/Input";
import Layout from "components/core/Layout";
import PageTitle from "components/core/PageTitle";
import Tip from "components/core/Tip";
import useDebounce from "hooks/useDebounce";
import useQueryWithUpdater from "hooks/useQueryWithUpdater";
import { useState } from "react";
import { List, QueryKeys } from "types";

import AddListModal from "../AddListModal";
import ListLink from "../ListLink";

export default function Lists() {
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const {
    data: lists = [],
    setData: setLists,
    isLoading,
    hasLoadedData,
  } = useQueryWithUpdater<List[]>([QueryKeys.LISTS_LIST, debouncedQuery], () =>
    getLists(query)
  );

  return (
    <Layout>
      <div className="space-y-8 lg:space-y-16">
        <div className="flex flex-wrap justify-between items-center">
          <PageTitle>Lists</PageTitle>
          <div className="w-full mt-4 md:w-auto md:mt-0">
            <SearchInput
              placeholder="Search lists..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
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
                <div className="divide-gray-200 divide-y">
                  {lists.map((list) => (
                    <ListLink key={list._id} list={list} />
                  ))}
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
