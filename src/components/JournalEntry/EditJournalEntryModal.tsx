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

  async function deleteEntry() {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      await http.delete(
        reverse(Urls.api["journal:entry"], {
          journalId: entry.journalId,
          entryId: entry._id,
        })
      );

      props.onClose(true);
    }
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
      <Modal.Footer>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => deleteEntry()} theme="link--danger" fluid>
            <Icon variant="fa-trash" />
            <span> Delete entry</span>
          </Button>
          <Button
            disabled={isSaving}
            type="submit"
            form={`edit-entry-${entry._id}`}
            fluid
          >
            {isSaving ? (
              <>
                <Icon variant="fa-circle-o-notch" spin />
                <SROnly>Saving...</SROnly>
              </>
            ) : (
              "Save entry"
            )}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
