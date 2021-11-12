import Modal, { ModalProps } from "components/core/Modal";
import SubmitButton from "components/core/SubmitButton";
import Urls from "constants/urls";
import { reverse } from "named-urls";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";
import { Journal, JournalFormData, QueryKeys } from "types";
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
  const queryClient = useQueryClient();
  const history = useHistory();
  const [isSaving, setIsSaving] = useState(false);

  async function saveItem(values: JournalFormData) {
    setIsSaving(true);

    const newJournal = await createJournal(values);

    setIsSaving(false);

    queryClient.removeQueries(QueryKeys.JOURNAL_LIST);
    history.push(
      reverse(Urls.routes["journal:details"], { id: newJournal._id }),
      {
        name: newJournal.name,
      }
    );
  }

  return (
    <Modal ariaLabel="Create a new journal" title="Create journal" {...props}>
      <Modal.Body>
        <JournalForm
          formId="create-journal-form"
          submitButtonLabel="Save"
          isSubmitting={isSaving}
          onSubmit={saveItem}
        />
      </Modal.Body>
      <Modal.Footer>
        <div className="text-right">
          <SubmitButton isSubmitting={isSaving} formId="create-journal-form">
            Create journal
          </SubmitButton>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
