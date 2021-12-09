import { createGroup } from "api/lists";
import Modal, { ModalProps } from "components/core/Modal";
import SubmitButton from "components/core/SubmitButton";
import useList from "hooks/useList";
import { useState } from "react";
import { FormIds, ListGroupFormData } from "types";

import GroupForm from "../GroupForm";

type Props = Pick<ModalProps, "onClose" | "isOpen">;

export default function AddGroupModal({ isOpen, onClose }: Props) {
  const { list, updateList } = useList();
  const [isAdding, setIsAdding] = useState(false);

  async function handleSubmit(values: ListGroupFormData) {
    setIsAdding(true);

    const newGroup = await createGroup({
      ...values,
      listId: list._id,
      sortOrder: list.groups.length,
    });

    updateList((draft) => {
      if (!draft) return;

      return {
        ...draft,
        groups: [...draft.groups, newGroup],
      };
    });

    setIsAdding(false);
    onClose();
  }

  return (
    <Modal
      ariaLabel="Add a new group"
      title="Add group"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Modal.Body>
        <GroupForm formId={FormIds.ADD_LIST_GROUP} onSubmit={handleSubmit} />
      </Modal.Body>
      <Modal.Footer className="text-right">
        <SubmitButton isSubmitting={isAdding} formId={FormIds.ADD_LIST_GROUP}>
          Add group
        </SubmitButton>
      </Modal.Footer>
    </Modal>
  );
}
