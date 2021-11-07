import { updateItem } from "api/lists";
import Modal, { ModalProps } from "components/core/Modal";
import SubmitButton from "components/core/SubmitButton";
import useList from "hooks/useList";
import { useState } from "react";
import { FormIds, ListItem, ListItemFormData } from "types";

import ListItemForm from "../ItemForm";

type Props = Pick<ModalProps, "onClose" | "isOpen"> & {
  item: ListItem;
};

export default function EditItemModal({ item, ...props }: Props) {
  const { list, updateList } = useList();
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleSubmit(values: ListItemFormData) {
    setIsUpdating(true);

    const relatedGroupIndex = list.groups.findIndex(
      (g) => g._id === item.groupId
    )!;

    const updatedItem = await updateItem(item._id, values);

    updateList(({ groups: currentGroups }) => {
      currentGroups[relatedGroupIndex].items[item.sortOrder] = updatedItem;
    });

    setIsUpdating(false);
    props.onClose();
  }

  return (
    <Modal ariaLabel="Edit item" title="Edit item" {...props}>
      <Modal.Body>
        <ListItemForm
          formId={FormIds.EDIT_LIST_ITEM}
          initialData={{
            title: item.title,
          }}
          onSubmit={handleSubmit}
        />
      </Modal.Body>
      <Modal.Footer className="text-right">
        <SubmitButton isSubmitting={isUpdating} formId={FormIds.EDIT_LIST_ITEM}>
          Save item
        </SubmitButton>
      </Modal.Footer>
    </Modal>
  );
}
