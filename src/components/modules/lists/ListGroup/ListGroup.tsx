import { deleteGroup as deleteGroupApi } from "api/lists";
import classNames from "classnames";
import Button from "components/core/Button";
import ConfirmModal from "components/core/ConfirmModal";
import ContextMenu from "components/core/ContextMenu";
import Icon, { Bars, Plus } from "components/core/Icon";
import useList from "hooks/useList";
import { useState } from "react";
import {
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import { ListGroup as ListGroupType } from "types";

import AddItemModal from "../AddItemModal";
import EditGroupModal from "../EditGroupModal";
import ListItem from "../ListItem";

type Props = {
  canDrag?: boolean;
  group: ListGroupType;
  index: number;
};

export default function Group({ canDrag, index, group }: Props) {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const { updateList } = useList();

  async function deleteGroup() {
    await deleteGroupApi(group._id);

    updateList((draft) => {
      if (!draft) return;

      return {
        ...draft,
        groups: draft.groups.filter((g) => g._id !== group._id),
      };
    });
  }

  return (
    <Draggable isDragDisabled={!canDrag} draggableId={group._id} index={index}>
      {(provided: DraggableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="space-y-4 py-4"
        >
          <div className="flex items-center justify-between bg-primary-100 rounded-full py-2 px-6">
            <div className="text-primary-800">{group.name}</div>
            <div className="flex items-center space-x-2">
              <div
                className={classNames(
                  "cursor-move text-primary-400 hover:text-primary-600",
                  {
                    hidden: !canDrag,
                  }
                )}
                {...provided.dragHandleProps}
                aria-label="Move group"
              >
                <Icon size={16} strokeWidth={3} icon={Bars} />
              </div>
              <ContextMenu>
                <ContextMenu.Action onClick={() => setIsEditingGroup(true)}>
                  Edit
                </ContextMenu.Action>
                <ContextMenu.Action onClick={() => setIsConfirmingDelete(true)}>
                  Delete
                </ContextMenu.Action>
              </ContextMenu>
            </div>
          </div>
          <div className="mr-6 pl-4">
            <Droppable droppableId={group._id} type="ITEM">
              {(dropProvided: DroppableProvided) => (
                <div
                  className="ml-4 mb-4"
                  {...dropProvided.droppableProps}
                  ref={dropProvided.innerRef}
                >
                  {group?.items?.map((item, index) => {
                    return (
                      <ListItem
                        canDrag={group?.items.length > 1}
                        index={index}
                        item={item}
                        key={item._id}
                      />
                    );
                  })}
                  {dropProvided.placeholder}
                </div>
              )}
            </Droppable>
            <Button
              className="ml-14"
              onClick={() => setIsAddingItem(true)}
              theme="link--muted"
            >
              <Icon size={16} strokeWidth={3} icon={Plus} />
              <span>Add item</span>
            </Button>
          </div>

          {/* Modal Actions */}
          <AddItemModal
            groupId={group._id}
            isOpen={isAddingItem}
            onClose={() => setIsAddingItem(false)}
          />
          <EditGroupModal
            group={group}
            isOpen={isEditingGroup}
            onClose={() => setIsEditingGroup(false)}
          />
          <ConfirmModal
            isOpen={isConfirmingDelete}
            ariaLabel="Confirm group delete"
            title={
              group.items.length
                ? "Are you sure you want to delete this group? All items will be deleted and this action cannot be undone!"
                : "Are you sure you want to delete this group?"
            }
            onConfirm={deleteGroup}
            onClose={() => setIsConfirmingDelete(false)}
          />
        </div>
      )}
    </Draggable>
  );
}
