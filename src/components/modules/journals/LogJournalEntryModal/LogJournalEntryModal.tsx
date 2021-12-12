import { createEntry, uploadImages } from "api/journals";
import Modal, { ModalProps } from "components/core/Modal";
import SubmitButton from "components/core/SubmitButton";
import { useState } from "react";
import { BlobWithPreview, EntryFormData } from "types";

import EntryForm from "../EntryForm";

type Props = Pick<ModalProps, "isOpen"> & {
  onClose: (refetch?: boolean) => void;
  journalId: string;
};

export default function LogEntryModal({ journalId, ...props }: Props) {
  const [isSaving, setIsSaving] = useState(false);

  async function saveItem(values: EntryFormData) {
    const { images: formImages, ...remainingData } = values;
    setIsSaving(true);

    try {
      let images: string[] = [];

      if (formImages.length) {
        const uploadedImages = await uploadImages(
          formImages as BlobWithPreview[]
        );
        images = uploadedImages.map((img) => img._id);
      }

      await createEntry(journalId, {
        ...remainingData,
        images,
      });

      props.onClose(true);
    } catch {
      // TODO
    } finally {
      setIsSaving(false);
    }
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
