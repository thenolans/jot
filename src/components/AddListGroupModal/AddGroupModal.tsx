import ListGroupForm from "components/ListGroupForm";
import Modal, { ModalProps } from "components/Modal";
import Urls from "constants/urls";
import useList from "hooks/useList";
import { useState } from "react";
import { ListGroupFormData } from "types";
import http from "utils/http";

type Props = Pick<ModalProps, "onClose" | "isOpen">;

async function saveNewGroup(
  data: ListGroupFormData & { sortOrder: number },
  listId: string
) {
  return http
    .post(Urls.api["listGroups:list"], {
      ...data,
      listId,
    })
    .then((res) => res.data.data);
}

export default function AddGroupModal({ isOpen, onClose }: Props) {
  const { listId, groups, updateGroups } = useList();
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleSubmit(values: ListGroupFormData) {
    setIsProcessing(true);

    const addedGroup = await saveNewGroup(
      {
        ...values,
        sortOrder: groups.length,
      },
      listId
    );
    updateGroups([...groups, addedGroup]);

    setIsProcessing(false);
    onClose();
  }

  return (
    <Modal
      ariaLabel="Create a new group"
      title="Add group"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Modal.Body>
        <ListGroupForm isSubmitting={isProcessing} onSubmit={handleSubmit} />
      </Modal.Body>
    </Modal>
  );
}
