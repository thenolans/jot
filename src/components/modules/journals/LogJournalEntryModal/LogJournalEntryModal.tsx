import Modal, { ModalProps } from "components/core/Modal";
import SubmitButton from "components/core/SubmitButton";
import Urls from "constants/urls";
import { reverse } from "named-urls";
import { useState } from "react";
import { Entry, EntryFormData } from "types";
import http from "utils/http";

import EntryForm from "../EntryForm";

type Props = Pick<ModalProps, "isOpen"> & {
  onClose: (refetch?: boolean) => void;
  journalId: string;
};

async function logEntry(
  journalId: string,
  data: EntryFormData
): Promise<Entry> {
  return http
    .post(reverse(Urls.api["journal:entries"], { id: journalId }), data)
    .then((res) => res.data.data);
}

export default function LogEntryModal({ journalId, ...props }: Props) {
  const [isSaving, setIsSaving] = useState(false);

  async function saveItem(values: EntryFormData) {
    setIsSaving(true);

    await logEntry(journalId, values);

    setIsSaving(false);

    props.onClose(true);
  }

  return (
    <Modal ariaLabel="Log an entry" title="Log an entry" {...props}>
      <Modal.Scroll>
        <Modal.Body>
          <EntryForm formId="log-entry-form" onSubmit={saveItem} />
        </Modal.Body>
      </Modal.Scroll>
      <Modal.Footer>
        <SubmitButton isSubmitting={isSaving} formId="log-entry-form" fluid>
          Save entry
        </SubmitButton>
      </Modal.Footer>
    </Modal>
  );
}
