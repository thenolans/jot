import Button from "components/Button";
import Dialog from "components/Dialog";
import Input from "components/Input";
import { SyntheticEvent, useState } from "react";

type Props = {
  isOpen?: boolean;
  onClose: () => void;
};

export default function FilterDialog({ isOpen = false, onClose }: Props) {
  const [title, setTitle] = useState("");

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();

    onClose();
  }

  return (
    <Dialog onClose={onClose} isOpen={isOpen} title="Add entry">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label
            className="text-sm text-gray-500 block mb-1"
            htmlFor="create--title"
          >
            Title
          </label>
          <Input
            id="create--title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </div>
        <Button type="submit" options={{ fluid: true }}>
          Add entry
        </Button>
      </form>
    </Dialog>
  );
}
