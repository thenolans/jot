import Button from "components/core/Button";
import Container from "components/core/Container";
import Icon from "components/core/Icon";
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
import { useQuery } from "react-query";
import { useRouteMatch } from "react-router";
import { List as ListType, ListGroup as ListGroupType, ListItem } from "types";
import { useImmer } from "use-immer";
import http from "utils/http";
import moveItemBetweenArrays from "utils/moveItemBetweenArrays";
import reorder from "utils/reorder";

import AddListGroupModal from "../AddListGroupModal";
import ListGroup from "../ListGroup";

type Params = {
  id: string;
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
  const match = useRouteMatch<Params>();
  const listId = match.params.id;
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [groups, updateGroups] = useImmer<ListGroupType[]>([]);
  const { data, isFetching } = useQuery(
    ["list", listId],
    () => fetchList(listId),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  useNProgress(isProcessing);

  useEffect(() => {
    if (data) {
      updateGroups(data.groups);
    }
  }, [data, updateGroups]);

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

  if (isFetching) {
    return (
      <Container>
        <div className="text-center py-4 space-y-4">
          <Icon
            className="text-gray-300"
            variant="fa-circle-o-notch"
            size="fa-3x"
            spin
          />
          <div className="sr-only">Loading...</div>
        </div>
      </Container>
    );
  }

  if (!data) return null;

  return (
    <ListContext.Provider
      value={{
        listId,
        groups,
        updateGroups,
      }}
    >
      <Container>
        <div className="space-y-8 py-16">
          <h2 className="text-center text-3xl text-primary-700">{data.name}</h2>
          {!groups.length ? (
            <div className="text-center space-y-6 py-6">
              <div className="px-24 text-lg text-gray-500">
                You have not added any items to this list, yet!
              </div>
              <Button onClick={() => setIsAddingGroup(true)}>Add group</Button>
            </div>
          ) : (
            <div>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="groups" type="GROUP">
                  {(provided: DroppableProvided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {groups.map((group, index) => {
                        return (
                          <ListGroup
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
                  className="bg-gray-100 text-gray-400 hover:bg-primary-600 hover:text-white h-auto py-2"
                  theme="none"
                  onClick={() => setIsAddingGroup(true)}
                  fluid
                >
                  <Icon variant="fa-plus" />
                  <span>Add group</span>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <AddListGroupModal
          isOpen={isAddingGroup}
          onClose={() => setIsAddingGroup(false)}
        />
      </Container>
    </ListContext.Provider>
  );
}
