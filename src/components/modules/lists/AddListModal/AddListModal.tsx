import Modal, { ModalProps } from "components/core/Modal";
import Urls from "constants/urls";
import { useState } from "react";
import { List, ListFormData } from "types";
import http from "utils/http";

import ListForm from "../ListForm";

type Props = Pick<ModalProps, "isOpen"> & {
  onClose: (newList?: List) => void;
};

async function createList(data: ListFormData) {
  return http.post(Urls.api["lists:list"], data).then((res) => res.data.data);
}

export default function AddItemModal(props: Props) {
  const [isSaving, setIsSaving] = useState(false);

  async function addList(data: ListFormData) {
    setIsSaving(true);

    const newList = await createList(data);

    setIsSaving(false);

    props.onClose(newList);
  }

  return (
    <Modal ariaLabel="Add a new list" title="Add list" {...props}>
      <Modal.Body>
        <ListForm isSubmitting={isSaving} onSubmit={(data) => addList(data)} />
      </Modal.Body>
    </Modal>
  );
}
