import Button from "components/Button";
import Dialog from "components/Dialog";
import EntryForm from "components/EntryForm";
import useEntries from "hooks/useEntries";
import { useState } from "react";

type Props = {
  isOpen?: boolean;
  onClose: () => void;
};

export default function CreateDialog({ isOpen = false, onClose }: Props) {
  const [isCreating, setIsCreating] = useState(false);
  const { addEntry } = useEntries();

  async function createEntry(data: any) {
    setIsCreating(true);

    await addEntry(data);

    onClose();
    setIsCreating(false);
  }

  return (
    <Dialog onClose={onClose} isOpen={isOpen} title="Add entry">
      <Dialog.Content>
        <EntryForm
          formId="create-entry-form"
          onSubmit={(data) => createEntry(data)}
        />
      </Dialog.Content>
      <Dialog.Footer>
        <Button
          disabled={isCreating}
          type="submit"
          form="create-entry-form"
          options={{ fluid: true }}
        >
          {isCreating ? (
            <i className="fa fa-circle-o-notch fa-spin" />
          ) : (
            "Log Entry"
          )}
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}
