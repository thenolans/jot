import Button from "components/Button";
import Dialog from "components/Dialog";
import EntryForm from "components/EntryForm";
import Urls from "constants/urls";
import http from "utils/http";

type Props = {
  isOpen?: boolean;
  onClose: () => void;
};

export default function CreateDialog({ isOpen = false, onClose }: Props) {
  async function createEntry(data: any) {
    await http.post(Urls.api.entries, data);

    onClose();
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
          type="submit"
          form="create-entry-form"
          options={{ fluid: true }}
        >
          Log entry
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}
