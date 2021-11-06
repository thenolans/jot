import Modal, { ModalProps } from "components/core/Modal";
import Urls from "constants/urls";
import useList from "hooks/useList";
import { reverse } from "named-urls";
import { useState } from "react";
import { ListGroup, ListGroupFormData } from "types";
import http from "utils/http";

import ListGroupForm from "../ListGroupForm";

type Props = Pick<ModalProps, "onClose" | "isOpen"> & {
  group: ListGroup;
};

async function saveGroupRequest(data: ListGroupFormData, groupId: string) {
  return http
    .patch(reverse(Urls.api["listGroup:details"], { id: groupId }), data)
    .then((res) => res.data.data);
}

export default function EditGroupModal({ isOpen, onClose, group }: Props) {
  const { updateList } = useList();
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleSubmit(values: ListGroupFormData) {
    setIsProcessing(true);

    const updatedGroup = await saveGroupRequest(values, group._id);
    updateList(({ groups: currentGroups }) => {
      const updatedIndex = currentGroups.findIndex((g) => g._id === group._id);
      currentGroups[updatedIndex] = updatedGroup;
    });

    setIsProcessing(false);
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
        <ListGroupForm
          initialData={{
            name: group.name,
          }}
          isSubmitting={isProcessing}
          onSubmit={handleSubmit}
        />
      </Modal.Body>
    </Modal>
  );
}
