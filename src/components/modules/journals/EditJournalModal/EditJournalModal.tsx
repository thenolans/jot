import Modal, { ModalProps } from "components/core/Modal";
import SubmitButton from "components/core/SubmitButton";
import Urls from "constants/urls";
import { reverse } from "named-urls";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { Journal, JournalFormData, QueryKeys } from "types";
import http from "utils/http";

import JournalForm from "../JournalForm";

type Props = Pick<ModalProps, "isOpen"> & {
  onClose: (newJournal?: Journal) => void;
  journal: Journal;
};

async function patchJournal(
  journalId: string,
  data: JournalFormData
): Promise<Journal> {
  return http
    .patch(
      reverse(Urls.api["journal:details"], {
        id: journalId,
      }),
      data
    )
    .then((res) => res.data.data);
}

export default function EditJournalModal({ journal, ...props }: Props) {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  async function saveJournal(values: JournalFormData) {
    setIsSaving(true);

    const updatedJournal = await patchJournal(journal._id, values);

    setIsSaving(false);

    queryClient.removeQueries(QueryKeys.JOURNAL_LIST);
    props.onClose(updatedJournal);
  }

  return (
    <Modal ariaLabel="Edit journal" title="Edit journal" {...props}>
      <Modal.Body>
        <JournalForm
          formId={`edit-journal-${journal._id}-form`}
          initialData={journal}
          submitButtonLabel="Save"
          isSubmitting={isSaving}
          onSubmit={saveJournal}
        />
      </Modal.Body>
      <Modal.Footer className="text-right">
        <SubmitButton
          isSubmitting={isSaving}
          formId={`edit-journal-${journal._id}-form`}
        >
          Save
        </SubmitButton>
      </Modal.Footer>
    </Modal>
  );
}
