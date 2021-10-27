import ItemForm from "components/ListItemForm";
import Modal, { ModalProps } from "components/Modal";
import Urls from "constants/urls";
import useList from "hooks/useList";
import { useState } from "react";
import { ListItem, ListItemFormData } from "types";
import http from "utils/http";

type Props = Pick<ModalProps, "onClose" | "isOpen"> & {
  groupId: string;
};

async function createItem(data: Omit<ListItem, "_id" | "isCompleted">) {
  return http
    .post(Urls.api["listItems:list"], data)
    .then((res) => res.data.data);
}

export default function AddItemModal({ groupId, ...props }: Props) {
  const { groups, updateGroups } = useList();
  const [isSaving, setIsSaving] = useState(false);

  async function saveItem(values: ListItemFormData) {
    setIsSaving(true);

    const relatedGroupIndex = groups.findIndex((g) => g._id === groupId)!;
    const relatedItems = groups[relatedGroupIndex].items;
    const [lastRelatedItem] = relatedItems.slice(-1);

    const newItem = await createItem({
      ...values,
      groupId,
      sortOrder: lastRelatedItem ? lastRelatedItem.sortOrder + 1 : 0,
    });

    updateGroups((currentGroups) => {
      currentGroups[relatedGroupIndex].items = [...relatedItems, newItem];
    });

    setIsSaving(false);
    props.onClose();
  }

  return (
    <Modal ariaLabel="Add a new item" title="Add item" {...props}>
      <Modal.Body>
        <ItemForm isSubmitting={isSaving} onSubmit={saveItem} />
      </Modal.Body>
    </Modal>
  );
}
