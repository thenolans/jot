import Modal, { ModalProps } from "components/core/Modal";
import SubmitButton from "components/core/SubmitButton";
import Urls from "constants/urls";
import { reverse } from "named-urls";
import { useState } from "react";
import { Entry, EntryFormData } from "types";
import http from "utils/http";

import EntryForm from "../EntryForm";

type Props = Pick<ModalProps, "isOpen"> & {
  onClose: (shouldRefetch?: boolean) => void;
  entry: Entry;
};

async function saveEntry(
  data: EntryFormData,
  journalId: string,
  entryId: string
): Promise<Entry> {
  return http
    .patch(reverse(Urls.api["journal:entry"], { journalId, entryId }), data)
    .then((res) => res.data.data);
}

export default function EditJournalEntryModal({ entry, ...props }: Props) {
  const [isSaving, setIsSaving] = useState(false);

  async function saveItem(values: EntryFormData) {
    setIsSaving(true);

    await saveEntry(values, entry.journalId, entry._id);

    setIsSaving(false);

    props.onClose(true);
  }

  return (
    <Modal
      ariaLabel="Edit a journal entry"
      title="Edit journal entry"
      {...props}
    >
      <Modal.Body>
        <EntryForm
          formId={`edit-entry-${entry._id}`}
          initialData={{
            ...entry,
            tags: entry.tags.map((tag) => tag._id),
          }}
          onSubmit={saveItem}
        />
      </Modal.Body>
      <Modal.Footer className="text-right">
        <SubmitButton
          isSubmitting={isSaving}
          formId={`edit-entry-${entry._id}`}
        >
          Save entry
        </SubmitButton>
      </Modal.Footer>
    </Modal>
  );
}
