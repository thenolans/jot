import { updateGroup } from "api/lists";
import Modal, { ModalProps } from "components/core/Modal";
import SubmitButton from "components/core/SubmitButton";
import useList from "hooks/useList";
import { useState } from "react";
import { FormIds, ListGroup, ListGroupFormData } from "types";

import GroupForm from "../GroupForm";

type Props = Pick<ModalProps, "onClose" | "isOpen"> & {
  group: ListGroup;
};

export default function EditGroupModal({ isOpen, onClose, group }: Props) {
  const { updateList } = useList();
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleSubmit(values: ListGroupFormData) {
    setIsUpdating(true);

    const updatedGroup = await updateGroup(group._id, values);

    updateList(({ groups: currentGroups }) => {
      const updatedIndex = currentGroups.findIndex((g) => g._id === group._id);
      currentGroups[updatedIndex] = updatedGroup;
    });

    setIsUpdating(false);
    onClose();
  }

  return (
    <Modal
      ariaLabel="Edit group"
      title="Edit group"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Modal.Body>
        <GroupForm
          formId={FormIds.EDIT_LIST_GROUP}
          initialData={{
            name: group.name,
          }}
          onSubmit={handleSubmit}
        />
      </Modal.Body>
      <Modal.Footer className="text-right">
        <SubmitButton
          isSubmitting={isUpdating}
          formId={FormIds.EDIT_LIST_GROUP}
        >
          Save group
        </SubmitButton>
      </Modal.Footer>
    </Modal>
  );
}
