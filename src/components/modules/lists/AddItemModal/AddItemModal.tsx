import { createItem } from "api/lists";
import Modal, { ModalProps } from "components/core/Modal";
import SubmitButton from "components/core/SubmitButton";
import useList from "hooks/useList";
import { useState } from "react";
import { FormIds, ListItemFormData } from "types";

import ItemForm from "../ItemForm";

type Props = Pick<ModalProps, "onClose" | "isOpen"> & {
  groupId: string;
};

export default function AddItemModal({ groupId, ...props }: Props) {
  const { list, updateList } = useList();
  const [isAdding, setIsAdding] = useState(false);

  async function handleSubmit(values: ListItemFormData) {
    setIsAdding(true);

    const relatedGroupIndex = list.groups.findIndex((g) => g._id === groupId)!;
    const relatedItems = list.groups[relatedGroupIndex].items;
    const [lastRelatedItem] = relatedItems.slice(-1);

    const newItem = await createItem({
      ...values,
      groupId,
      isCompleted: false,
      sortOrder: lastRelatedItem ? lastRelatedItem.sortOrder + 1 : 0,
    });

    updateList(({ groups: currentGroups }) => {
      currentGroups[relatedGroupIndex].items = [...relatedItems, newItem];
    });

    setIsAdding(false);
    props.onClose();
  }

  return (
    <Modal ariaLabel="Add a new item" title="Add item" {...props}>
      <Modal.Body>
        <ItemForm formId={FormIds.ADD_LIST_ITEM} onSubmit={handleSubmit} />
      </Modal.Body>
      <Modal.Footer className="text-right">
        <SubmitButton isSubmitting={isAdding} formId={FormIds.ADD_LIST_ITEM}>
          Add item
        </SubmitButton>
      </Modal.Footer>
    </Modal>
  );
}
