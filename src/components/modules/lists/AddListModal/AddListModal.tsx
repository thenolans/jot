import { createList } from "api/lists";
import Modal, { ModalProps } from "components/core/Modal";
import SubmitButton from "components/core/SubmitButton";
import Urls from "constants/urls";
import { reverse } from "named-urls";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { FormIds, List, ListFormData } from "types";

import ListForm from "../ListForm";

type Props = Pick<ModalProps, "isOpen"> & {
  onClose: () => void;
  onAdd: (newList: List) => void;
};

export default function AddListModal({ onAdd, ...props }: Props) {
  const history = useHistory();
  const [isAdding, setIsAdding] = useState(false);

  async function handleSubmit(data: ListFormData) {
    setIsAdding(true);

    const newList = await createList(data);

    setIsAdding(false);

    onAdd({
      ...newList,
      itemCount: 0,
    });

    history.push(reverse(Urls.routes["list:details"], { id: newList._id }));
  }

  return (
    <Modal ariaLabel="Add a new list" title="Add list" {...props}>
      <Modal.Body>
        <ListForm formId={FormIds.ADD_LIST} onSubmit={handleSubmit} />
      </Modal.Body>
      <Modal.Footer className="text-right">
        <SubmitButton isSubmitting={isAdding} formId={FormIds.ADD_LIST}>
          Add list
        </SubmitButton>
      </Modal.Footer>
    </Modal>
  );
}
