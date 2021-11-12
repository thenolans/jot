import { deleteItem as deleteItemApi, updateItem } from "api/lists";
import classNames from "classnames";
import Checkbox from "components/core/Checkbox";
import ConfirmModal from "components/core/ConfirmModal";
import ContextMenu from "components/core/ContextMenu";
import Icon, { Bars } from "components/core/Icon";
import useList from "hooks/useList";
import { useEffect } from "react";
import { useState } from "react";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import { ListItem as ListItemType } from "types";

import EditItemModal from "../EditItemModal";

type Props = {
  canDrag?: boolean;
  index: number;
  item: ListItemType;
};

export default function Item({ canDrag, index, item }: Props) {
  const { updateList, list } = useList();
  const [isCompleted, setIsCompleted] = useState(item.isCompleted);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isEditingItem, setIsEditingItem] = useState(false);

  useEffect(() => {
    setIsCompleted(item.isCompleted);
  }, [item.isCompleted]);

  function removeItemFromList() {
    updateList((draft) => {
      if (!draft) return;

      const currentGroupIndex = draft.groups.findIndex(
        (g) => g._id === item.groupId
      );
      const currentGroupItems = draft.groups[currentGroupIndex].items;
      draft.groups[currentGroupIndex].items = currentGroupItems.filter(
        (i) => i._id !== item._id
      );
    });
  }

  function updateItemInList(data: Partial<ListItemType>) {
    updateList((draft) => {
      if (!draft) return;

      const currentGroupIndex = draft.groups.findIndex(
        (g) => g._id === item.groupId
      );
      const currentGroupItems = draft.groups[currentGroupIndex].items;
      draft.groups[currentGroupIndex].items = currentGroupItems.map((i) => {
        if (i._id === item._id) {
          return {
            ...item,
            ...data,
          };
        }
        return i;
      });
    });
  }

  async function deleteItem() {
    await deleteItemApi(item._id);
    removeItemFromList();
  }

  async function toggleCompleted(newCompletedState: boolean) {
    if (!list.showCompletedItems && newCompletedState) {
      removeItemFromList();
    } else {
      updateItemInList({ isCompleted: newCompletedState });
    }

    updateItem(item._id, {
      isCompleted: newCompletedState,
    });
  }

  return (
    <>
      <Draggable
        isDragDisabled={!(canDrag || list.groups.length > 1)}
        key={item._id}
        draggableId={item._id}
        index={index}
      >
        {(dragProvided: DraggableProvided) => (
          <div
            className="py-2 flex items-center justify-between space-x-2"
            ref={dragProvided.innerRef}
            {...dragProvided.draggableProps}
          >
            <Checkbox
              className="flex-grow"
              onChange={(e) => {
                setIsCompleted(e.target.checked);
                toggleCompleted(e.target.checked);
              }}
              checked={isCompleted}
              label={item.title}
              strikeThrough
            />
            <div className="flex items-center space-x-2 pl-4">
              <div
                className={classNames(
                  "cursor-move text-gray-300 hover:text-primary-600",
                  {
                    hidden: !(canDrag || list.groups.length > 1),
                  }
                )}
                {...dragProvided.dragHandleProps}
                aria-label="Move item"
              >
                <Icon size={16} strokeWidth={3} icon={Bars} />
              </div>
              <ContextMenu>
                <ContextMenu.Action onClick={() => setIsEditingItem(true)}>
                  Edit
                </ContextMenu.Action>
                <ContextMenu.Action onClick={() => setIsConfirmingDelete(true)}>
                  Delete
                </ContextMenu.Action>
              </ContextMenu>
            </div>
          </div>
        )}
      </Draggable>

      {/* Modal Actions */}
      <EditItemModal
        item={item}
        isOpen={isEditingItem}
        onClose={() => setIsEditingItem(false)}
      />
      <ConfirmModal
        isOpen={isConfirmingDelete}
        ariaLabel="Confirm item delete"
        title="Are you sure you want to delete this item?"
        onConfirm={deleteItem}
        onClose={() => setIsConfirmingDelete(false)}
      />
    </>
  );
}
