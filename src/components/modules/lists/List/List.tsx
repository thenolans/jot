import Button from "components/core/Button";
import Icon from "components/core/Icon";
import Layout from "components/core/Layout";
import PageTitle from "components/core/PageTitle";
import SROnly from "components/core/SROnly";
import Tip from "components/core/Tip";
import Urls from "constants/urls";
import ListContext from "contexts/list";
import useNProgress from "hooks/useNProgress";
import { reverse } from "named-urls";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";
import { useQuery, useQueryClient } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { List as ListType, ListGroup as ListGroupType, ListItem } from "types";
import { useImmer } from "use-immer";
import http from "utils/http";
import moveItemBetweenArrays from "utils/moveItemBetweenArrays";
import reorder from "utils/reorder";
import updateQueryCacheIfExists from "utils/updateQueryCacheIfExists";

import AddListGroupModal from "../AddListGroupModal";
import EditListModal from "../EditListModal";
import ListGroup from "../ListGroup";

type Params = {
  id: string;
};

type Location = {
  state: {
    name?: string;
  };
};

function fetchList(listId: string): Promise<ListType> {
  return http
    .get(reverse(Urls.api["list:details"], { id: listId }))
    .then((res) => res.data.data);
}

function saveGroupOrder(groups: ListGroupType[]) {
  return http.post(
    Urls.api["listGroups:reorder"],
    groups.map((g) => ({ id: g._id, sortOrder: g.sortOrder }))
  );
}

function saveItemOrder(items: ListItem[]) {
  return http.post(
    Urls.api["listItems:reorder"],
    items.map((item) => ({
      id: item._id,
      sortOrder: item.sortOrder,
      groupId: item.groupId,
    }))
  );
}

export default function List() {
  const history = useHistory();
  const queryClient = useQueryClient();
  const location = useLocation();
  const match = useRouteMatch<Params>();
  const listId = match.params.id;
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditingList, setIsEditingList] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const { data, isLoading } = useQuery(["list", listId], () =>
    fetchList(listId)
  );
  const [groups, updateGroups] = useImmer<ListGroupType[]>(data?.groups || []);
  const passedName = (location as Location).state?.name;
  const [displayName, setDisplayName] = useState(
    passedName || data?.name || ""
  );

  useNProgress(isProcessing);

  useEffect(() => {
    if (data) {
      updateGroups(data.groups);
    }
  }, [data, updateGroups]);

  useEffect(() => {
    console.log("update");
    updateQueryCacheIfExists(
      queryClient,
      ["list", listId],
      (list: ListType) => ({
        ...list,
        groups,
      })
    );
  }, [queryClient, listId, groups]);

  async function handleDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    setIsProcessing(true);

    const { source, destination } = result;

    if (result.type === "ITEM") {
      // Moved within same list
      if (source.droppableId === destination.droppableId) {
        const groupId = source.droppableId;
        const groupIndex = groups.findIndex((g) => g._id === groupId)!;
        const newItemOrder = reorder(
          groups[groupIndex].items,
          source.index,
          destination.index
        ).map((item, index) => ({
          ...item,
          sortOrder: index,
        }));

        updateGroups((groups) => {
          groups[groupIndex].items = newItemOrder;
        });

        await saveItemOrder(newItemOrder);
      } else {
        // Moved between lists
        const sourceGroupIndex = groups.findIndex(
          (g) => g._id === source.droppableId
        )!;
        const destinationGroupIndex = groups.findIndex(
          (g) => g._id === destination.droppableId
        )!;
        const [newOrderedSourceItems, newOrderedDestinationItems] =
          moveItemBetweenArrays<ListItem>(
            groups[sourceGroupIndex].items,
            groups[destinationGroupIndex].items,
            source.index,
            destination.index
          );

        const newSourceItems = newOrderedSourceItems.map((item, index) => ({
          ...item,
          sortOrder: index,
          groupId: source.droppableId,
        }));
        const newDestinationItems = newOrderedDestinationItems.map(
          (item, index) => ({
            ...item,
            sortOrder: index,
            groupId: destination.droppableId,
          })
        );

        updateGroups((groups) => {
          groups[sourceGroupIndex].items = newSourceItems;
          groups[destinationGroupIndex].items = newDestinationItems;
        });
        await saveItemOrder([...newSourceItems, ...newDestinationItems]);
      }

      setIsProcessing(false);
    }

    if (result.type === "GROUP") {
      const reorderedGroups = reorder(
        groups,
        source.index,
        destination.index
      ).map((g, index) => ({
        ...g,
        sortOrder: index,
      }));

      updateGroups(reorderedGroups);
      await saveGroupOrder(reorderedGroups);

      return;
    }
  }

  return (
    <Layout>
      <div className="space-y-8 lg:space-y-16">
        <div className="flex justify-between items-center">
          <PageTitle>{displayName}</PageTitle>
          <Button
            onClick={() => setIsEditingList(true)}
            className="ml-4"
            theme="link--primary"
          >
            <Icon size="fa-2x" variant="fa-gear" />
            <SROnly>Edit list</SROnly>
          </Button>
        </div>
      </div>
      <ListContext.Provider
        value={{
          listId,
          groups,
          updateGroups,
        }}
      >
        <div className="space-y-8 py-16">
          {(() => {
            if (isLoading) {
              return (
                <div className="text-center space-y-4 text-primary-600">
                  <Icon size="fa-3x" variant="fa-circle-o-notch" spin />
                  <div>Fetching list details...</div>
                </div>
              );
            } else if (!groups.length) {
              return (
                <Tip
                  title="You have not added any groups to this list, yet!"
                  description="Groups allow you to organize list items into sections"
                  action={
                    <Button
                      theme="primary"
                      onClick={() => setIsAddingGroup(true)}
                    >
                      Add group
                    </Button>
                  }
                />
              );
            } else {
              return (
                <div>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="groups" type="GROUP">
                      {(provided: DroppableProvided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {groups.map((group, index) => {
                            return (
                              <ListGroup
                                canDrag={groups.length > 1}
                                index={index}
                                key={group._id}
                                group={group}
                              />
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  <div className="text-center mt-8">
                    <Button
                      theme="secondary"
                      onClick={() => setIsAddingGroup(true)}
                      fluid
                    >
                      <Icon variant="fa-plus" />
                      <span>Add group</span>
                    </Button>
                  </div>
                </div>
              );
            }
          })()}
        </div>

        {/* Modal Actions */}
        <AddListGroupModal
          isOpen={isAddingGroup}
          onClose={() => setIsAddingGroup(false)}
        />
        {data && (
          <EditListModal
            list={data}
            isOpen={isEditingList}
            onClose={() => setIsEditingList(false)}
            onUpdate={(updatedList) => {
              setDisplayName(updatedList.name);
              history.replace({ state: { name: updatedList.name } });
            }}
          />
        )}
      </ListContext.Provider>
    </Layout>
  );
}
