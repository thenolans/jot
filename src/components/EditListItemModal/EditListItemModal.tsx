import ListItemForm from "components/ListItemForm";
import Modal, { ModalProps } from "components/Modal";
import Urls from "constants/urls";
import useList from "hooks/useList";
import { reverse } from "named-urls";
import { useState } from "react";
import { ListItem, ListItemFormData } from "types";
import http from "utils/http";

type Props = Pick<ModalProps, "onClose" | "isOpen"> & {
  item: ListItem;
};

async function saveItemRequest(data: ListItemFormData, itemId: string) {
  return http
    .patch(reverse(Urls.api["listItem:details"], { id: itemId }), data)
    .then((res) => res.data.data);
}

export default function EditItemModal({ item, ...props }: Props) {
  const { groups, updateGroups } = useList();
  const [isSaving, setIsSaving] = useState(false);

  async function saveItem(values: ListItemFormData) {
    setIsSaving(true);

    const relatedGroupIndex = groups.findIndex((g) => g._id === item.groupId)!;
    const updatedItem = await saveItemRequest(values, item._id);

    updateGroups((currentGroups) => {
      currentGroups[relatedGroupIndex].items[item.sortOrder] = updatedItem;
    });

    setIsSaving(false);
    props.onClose();
  }

  return (
    <Modal ariaLabel="Edit item" title="Edit item" {...props}>
      <ListItemForm
        initialData={{
          title: item.title,
        }}
        isSubmitting={isSaving}
        onSubmit={saveItem}
      />
    </Modal>
  );
}
