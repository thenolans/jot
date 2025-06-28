import { Button, Icon } from "@thenolans/nolan-ui";

export default function AddNoteButton() {
  return (
    <Button
      className="fixed bottom-8 right-8 w-12 h-12 bg-primary-800 text-white rounded-lg flex items-center justify-center"
      theme="reset"
    >
      <Icon icon="Plus" />
      <span className="sr-only">Create new note</span>
    </Button>
  );
}
