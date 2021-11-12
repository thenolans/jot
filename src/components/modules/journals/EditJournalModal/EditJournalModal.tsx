import DeleteButton from "components/core/DeleteButton";
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
  const history = useHistory();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  async function saveJournal(values: JournalFormData) {
    setIsSaving(true);

    const updatedJournal = await patchJournal(journal._id, values);

    setIsSaving(false);

    queryClient.removeQueries(QueryKeys.JOURNAL_LIST);
    props.onClose(updatedJournal);
  }

  async function deleteJournal() {
    if (window.confirm("Are you sure you want to delete this journal?")) {
      await http.delete(
        reverse(Urls.api["journal:details"], {
          id: journal._id,
        })
      );

      queryClient.removeQueries(QueryKeys.JOURNAL_LIST);
      history.push(Urls.routes["journal:list"]);
    }
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
      <Modal.Footer>
        <div className="grid grid-cols-2 gap-2">
          <DeleteButton onClick={() => deleteJournal()} fluid>
            Delete
          </DeleteButton>
          <SubmitButton
            isSubmitting={isSaving}
            formId={`edit-journal-${journal._id}-form`}
          >
            Save
          </SubmitButton>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
