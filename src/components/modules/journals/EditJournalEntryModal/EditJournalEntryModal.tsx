import { updateEntry, uploadImages } from "api/journals";
import Modal, { ModalProps } from "components/core/Modal";
import SubmitButton from "components/core/SubmitButton";
import { useState } from "react";
import { BlobWithPreview, Entry, EntryFormData } from "types";

import EntryForm from "../EntryForm";

type Props = Pick<ModalProps, "isOpen"> & {
  onClose: (shouldRefetch?: boolean) => void;
  entry: Entry;
};

export default function EditJournalEntryModal({ entry, ...props }: Props) {
  const [isSaving, setIsSaving] = useState(false);

  async function saveItem({
    images: formImages,
    ...remainingValues
  }: EntryFormData) {
    setIsSaving(true);

    try {
      // @ts-expect-error
      let images = formImages.filter((img) => img.src).map((img) => img._id);
      const imagesToUpload = formImages.filter((img) =>
        // @ts-expect-error
        Boolean(img.preview)
      ) as BlobWithPreview[];

      if (imagesToUpload.length) {
        const uploadedImages = await uploadImages(
          imagesToUpload as BlobWithPreview[]
        );
        uploadedImages.forEach((img) => {
          images.push(img._id);
        });
      }

      await updateEntry(entry.journalId, entry._id, {
        ...remainingValues,
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
