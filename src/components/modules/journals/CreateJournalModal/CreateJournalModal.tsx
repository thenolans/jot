import Modal, { ModalProps } from "components/core/Modal";
import Urls from "constants/urls";
import { useState } from "react";
import { Journal, JournalFormData } from "types";
import http from "utils/http";

import JournalForm from "../JournalForm";

type Props = Pick<ModalProps, "isOpen"> & {
  onClose: (newJournal?: Journal) => void;
};

async function createJournal(data: JournalFormData): Promise<Journal> {
  return http
    .post(Urls.api["journals:list"], data)
    .then((res) => res.data.data);
}

export default function CreateJournalModal(props: Props) {
  const [isSaving, setIsSaving] = useState(false);

  async function saveItem(values: JournalFormData) {
    setIsSaving(true);

    const newJournal = await createJournal(values);

    setIsSaving(false);

    props.onClose(newJournal);
  }

  return (
    <Modal ariaLabel="Create a new journal" title="Create journal" {...props}>
      <Modal.Body>
        <JournalForm
          submitButtonLabel="Save"
          isSubmitting={isSaving}
          onSubmit={saveItem}
        />
      </Modal.Body>
    </Modal>
  );
}
