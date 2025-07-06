import { Button, Icon } from "@thenolans/nolan-ui";
import { ROUTE_PATHS } from "constants/urls";
import useNotes from "hooks/useNotes";
import { reverse } from "named-urls";
import { useNavigate } from "react-router-dom";

export default function AddNoteButton() {
  const navigate = useNavigate();
  const { addNote } = useNotes();

  async function handleAdd() {
    const { id, content } = await addNote();
    navigate(reverse(ROUTE_PATHS.editNote, { id }), {
      state: { noteContent: content },
    });
  }

  return (
    <Button
      className="fixed bottom-8 right-8 w-16 h-16 bg-primary-800 hover:bg-primary-900 transition-colors text-white rounded-lg flex items-center justify-center"
      theme="reset"
      onClick={() => handleAdd()}
    >
      <Icon size={32} icon="Plus" />
      <span className="sr-only">Create new note</span>
    </Button>
  );
}
