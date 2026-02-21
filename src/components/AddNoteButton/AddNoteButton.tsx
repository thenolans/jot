import { useQueryClient } from "@tanstack/react-query";
import { Button, Icon } from "@thenolans/nolan-ui";
import { createNote } from "api/notes";
import { ROUTE_PATHS } from "constants/urls";
import { reverse } from "named-urls";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { QueryKeys } from "types";

export default function AddNoteButton() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isAdding, setIsAdding] = useState(false);

  async function addNote() {
    setIsAdding(true);

    try {
      const newNote = await createNote({ content: "" });

      queryClient.invalidateQueries({
        queryKey: [QueryKeys.NOTES],
      });

      return newNote;
    } catch {
      // TODO
    } finally {
      setIsAdding(false);
    }
  }

  async function handleAdd() {
    const note = await addNote();
    if (note) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("editing_note_id", String(note.id));
      navigate(`${reverse(ROUTE_PATHS.notes)}?${newSearchParams.toString()}`);
    }
  }

  return (
    <Button
      className="fixed bottom-8 right-8 w-16 h-16 bg-primary-800 hover:bg-primary-900 transition-colors text-white rounded-lg flex items-center justify-center"
      theme="reset"
      onClick={() => handleAdd()}
      disabled={isAdding}
    >
      {isAdding ? (
        <Icon size={32} icon="Loader" className="animate-spin" />
      ) : (
        <Icon size={32} icon="Plus" />
      )}
      <span className="sr-only">Create new note</span>
    </Button>
  );
}
