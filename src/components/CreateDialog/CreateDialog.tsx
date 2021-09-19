import Button from "components/Button";
import Dialog from "components/Dialog";
import EntryForm from "components/EntryForm";
import Icon from "components/Icon";
import SROnly from "components/SROnly";
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
    <Dialog
      ariaLabel="Create a new entry"
      onClose={onClose}
      isOpen={isOpen}
      title="Add entry"
    >
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
          fluid
        >
          {isCreating ? (
            <>
              <Icon variant="fa-circle-o-notch" spin />
              <SROnly>Creating...</SROnly>
            </>
          ) : (
            "Log Entry"
          )}
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}
