import Button from "components/Button";
import EntryForm from "components/EntryForm";
import Icon from "components/Icon";
import Modal, { ModalProps } from "components/Modal";
import SROnly from "components/SROnly";
import Urls from "constants/urls";
import { reverse } from "named-urls";
import { useState } from "react";
import { Entry, EntryFormData } from "types";
import http from "utils/http";

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
      <Modal.Body>
        <EntryForm formId="log-entry-form" onSubmit={saveItem} />
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={isSaving} type="submit" form="log-entry-form" fluid>
          {isSaving ? (
            <>
              <Icon variant="fa-circle-o-notch" spin />
              <SROnly>Saving...</SROnly>
            </>
          ) : (
            "Save entry"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
