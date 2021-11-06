import Button from "components/core/Button";
import Icon from "components/core/Icon";
import Modal, { ModalProps } from "components/core/Modal";
import SROnly from "components/core/SROnly";
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
        <ListForm
          formId="create-list-form"
          isSubmitting={isSaving}
          onSubmit={(data) => addList(data)}
        />
      </Modal.Body>
      <Modal.Footer>
        <div className="text-right">
          <Button disabled={isSaving} type="submit" form="create-list-form">
            {isSaving ? (
              <>
                <Icon variant="fa-circle-o-notch" spin />
                <SROnly>Saving...</SROnly>
              </>
            ) : (
              "Create list"
            )}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
