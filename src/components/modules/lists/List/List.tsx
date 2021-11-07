import { getList, reorderGroups, reorderItems, resetList } from "api/lists";
import Button from "components/core/Button";
import ConfirmModal from "components/core/ConfirmModal";
import Icon from "components/core/Icon";
import Layout from "components/core/Layout";
import PageTitle from "components/core/PageTitle";
import SROnly from "components/core/SROnly";
import Tip from "components/core/Tip";
import ListContext from "contexts/list";
import useNProgress from "hooks/useNProgress";
import useQueryWithUpdater from "hooks/useQueryWithUpdater";
import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";
import { useLocation, useRouteMatch } from "react-router-dom";
import { List as ListType, ListItem, ListType as ListTypes } from "types";
import moveItemBetweenArrays from "utils/moveItemBetweenArrays";
import reorder from "utils/reorder";

import AddGroupModal from "../AddGroupModal.tsx";
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

export default function List() {
  const location = useLocation();
  const match = useRouteMatch<Params>();
  const listId = match.params.id;
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditingList, setIsEditingList] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const {
    data: list,
    setData: updateList,
    isLoading,
    hasLoadedData,
    refetch,
  } = useQueryWithUpdater<ListType>(["list", listId], () => getList(listId));
  const passedName = (location as Location).state?.name;
  const displayName = list?.name || passedName || "";
  const listIsReusable = list?.type === ListTypes.REUSABLE;

  useNProgress(isProcessing);

  async function resetAllItems() {
    updateList((draft) => {
      if (!draft) return;

      const newGroups = draft?.groups.map((group, index) => {
        const newItems = group.items.map((item) => {
          return {
            ...item,
            isCompleted: false,
          };
        });

        return {
          ...group,
          items: newItems,
        };
      });

      resetList(listId);

      draft.groups = newGroups;
    });

    setIsConfirmingReset(false);
  }

  async function handleDragEnd(result: DropResult) {
    if (!result.destination || !list) {
      return;
    }

    setIsProcessing(true);

    const { source, destination } = result;

    if (result.type === "ITEM") {
      // Moved within same list
      if (source.droppableId === destination.droppableId) {
        const groupId = source.droppableId;
        const groupIndex = list.groups.findIndex((g) => g._id === groupId)!;
        const newItemOrder = reorder(
          list.groups[groupIndex].items,
          source.index,
          destination.index
        ).map((item, index) => ({
          ...item,
          sortOrder: index,
        }));

        updateList((draft) => {
          if (!draft) return;

          draft.groups[groupIndex].items = newItemOrder;
        });

        await reorderItems(newItemOrder);
      } else {
        // Moved between lists
        const sourceGroupIndex = list.groups.findIndex(
          (g) => g._id === source.droppableId
        )!;
        const destinationGroupIndex = list.groups.findIndex(
          (g) => g._id === destination.droppableId
        )!;
        const [newOrderedSourceItems, newOrderedDestinationItems] =
          moveItemBetweenArrays<ListItem>(
            list.groups[sourceGroupIndex].items,
            list.groups[destinationGroupIndex].items,
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

        updateList((draft) => {
          if (!draft) return;

          draft.groups[sourceGroupIndex].items = newSourceItems;
          draft.groups[destinationGroupIndex].items = newDestinationItems;
        });
        await reorderItems([...newSourceItems, ...newDestinationItems]);
      }

      setIsProcessing(false);
    }

    if (result.type === "GROUP") {
      const reorderedGroups = reorder(
        list.groups,
        source.index,
        destination.index
      ).map((g, index) => ({
        ...g,
        sortOrder: index,
      }));

      updateList((draft) => ({ ...draft, groups: reorderedGroups }));
      await reorderGroups(reorderedGroups);

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
      <div className="space-y-8 py-8 md:py-16">
        {(() => {
          if (isLoading) {
            return (
              <div className="text-center space-y-4 text-primary-600">
                <Icon size="fa-3x" variant="fa-circle-o-notch" spin />
                <div>Fetching list details...</div>
              </div>
            );
          }

          if (!list) {
            return (
              <Tip
                title="There was a problem fetching this list"
                description="Please refresh the page and try again"
              />
            );
          }

          return (
            <ListContext.Provider
              value={{
                list,
                updateList,
              }}
            >
              {(() => {
                if (!list.groups.length && hasLoadedData) {
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
                }
                return (
                  <div>
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="groups" type="GROUP">
                        {(provided: DroppableProvided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {list.groups.map((group, index) => {
                              return (
                                <ListGroup
                                  canDrag={list.groups.length > 1}
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
                    {listIsReusable && (
                      <div className="text-center mt-8">
                        <Button
                          theme="link--danger"
                          onClick={() => setIsConfirmingReset(true)}
                        >
                          Reset all items
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Modal Actions */}
              <AddGroupModal
                isOpen={isAddingGroup}
                onClose={() => setIsAddingGroup(false)}
              />
              {list && (
                <EditListModal
                  list={list}
                  isOpen={isEditingList}
                  onClose={() => setIsEditingList(false)}
                  onUpdate={() => {
                    refetch();
                  }}
                />
              )}
              {listIsReusable && (
                <ConfirmModal
                  ariaLabel="Confirm reset all items"
                  isOpen={isConfirmingReset}
                  onClose={() => setIsConfirmingReset(false)}
                  onConfirm={() => resetAllItems()}
                  title="Are you sure you want to reset all items to be unchecked?"
                />
              )}
            </ListContext.Provider>
          );
        })()}
      </div>
    </Layout>
  );
}
