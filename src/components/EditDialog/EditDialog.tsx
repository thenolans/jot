import Button from "components/Button";
import Dialog from "components/Dialog";
import EntryForm from "components/EntryForm";
import Icon from "components/Icon";
import SROnly from "components/SROnly";
import useEntries from "hooks/useEntries";
import { useState } from "react";
import { EntryFormData } from "types";

type Props = {
  isOpen?: boolean;
  onClose: () => void;
};

export default function EditDialog({ isOpen = false, onClose }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const {
    saveEntry: saveEntryRequest,
    deleteEntry: deleteEntryRequest,
    entryToEdit,
  } = useEntries();

  async function saveEntry(data: EntryFormData) {
    setIsSaving(true);

    if (!entryToEdit) return setIsSaving(false);

    await saveEntryRequest(entryToEdit._id, data);

    onClose();
    setIsSaving(false);
  }

  async function deleteEntry() {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      if (!entryToEdit) return setIsSaving(false);

      await deleteEntryRequest(entryToEdit._id);
      onClose();
    }
  }

  if (!entryToEdit) return null;

  return (
    <Dialog
      ariaLabel="Edit an existing entry"
      onClose={onClose}
      isOpen={isOpen}
      title="Edit entry"
    >
      <Dialog.Content>
        <EntryForm
          initialData={{
            title: entryToEdit.title || "",
            notes: entryToEdit.notes || "",
            date: entryToEdit.date,
            tags: entryToEdit.tags.map((tag) => tag._id) || [],
          }}
          formId="edit-entry-form"
          onSubmit={(data) => saveEntry(data)}
        />
      </Dialog.Content>
      <Dialog.Footer>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => {
              deleteEntry();
            }}
            theme="link--danger"
          >
            Delete entry
          </Button>
          <Button type="submit" form="edit-entry-form" fluid>
            {isSaving ? (
              <>
                <Icon variant="fa-circle-o-notch" spin />
                <SROnly>Saving...</SROnly>
              </>
            ) : (
              "Save Entry"
            )}
          </Button>
        </div>
      </Dialog.Footer>
    </Dialog>
  );
}
