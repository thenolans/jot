import Checkbox from "components/core/Checkbox";
import ConfirmModal from "components/core/ConfirmModal";
import ContextMenu from "components/core/ContextMenu";
import Icon from "components/core/Icon";
import Urls from "constants/urls";
import useList from "hooks/useList";
import { reverse } from "named-urls";
import { useState } from "react";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import { ListItem as ListItemType } from "types";
import http from "utils/http";

import EditListItemModal from "../EditListItemModal";

type Props = {
  index: number;
  item: ListItemType;
};

export default function Item({ index, item }: Props) {
  const { updateGroups } = useList();
  const [isCompleted, setIsCompleted] = useState(item.isCompleted);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isEditingItem, setIsEditingItem] = useState(false);

  async function deleteItem() {
    await http.delete(reverse(Urls.api["listItem:details"], { id: item._id }));

    updateGroups((currentGroups) => {
      const currentGroupIndex = currentGroups.findIndex(
        (g) => g._id === item.groupId
      );
      const currentGroupItems = currentGroups[currentGroupIndex].items;
      currentGroups[currentGroupIndex].items = currentGroupItems.filter(
        (i) => i._id !== item._id
      );
    });
  }

  return (
    <>
      <Draggable key={item._id} draggableId={item._id} index={index}>
        {(dragProvided: DraggableProvided) => (
          <div
            className="py-2 flex items-center justify-between space-x-2"
            ref={dragProvided.innerRef}
            {...dragProvided.draggableProps}
          >
            <Checkbox
              className="flex-grow"
              onChange={(e) => setIsCompleted(e.target.checked)}
              checked={isCompleted}
              label={item.title}
            />
            <div className="flex items-center space-x-4 pl-4">
              <div
                className="cursor-move text-gray-300 hover:text-primary-600"
                {...dragProvided.dragHandleProps}
                aria-label="Move item"
              >
                <Icon variant="fa-bars" />
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
      <EditListItemModal
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
