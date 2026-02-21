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
      const folderIdParam = searchParams.get("folder_id");
      const folderId =
        folderIdParam && folderIdParam.trim() !== ""
          ? parseInt(folderIdParam, 10)
          : null;

      const newNote = await createNote({
        content: "",
        folder_id: folderId,
      });

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
      navigate(`${reverse(ROUTE_PATHS.notes)}?${newSearchParams.toString()}`, {
        replace: true,
      });
    }
  }

  return (
    <Button
      className="fixed bottom-4 right-4 w-12 h-12 sm:bottom-8 sm:right-8 sm:w-16 sm:h-16 bg-primary-800 hover:bg-primary-900 transition-colors text-white rounded-lg flex items-center justify-center"
      theme="reset"
      onClick={() => handleAdd()}
      disabled={isAdding}
    >
      {isAdding ? (
        <>
          <Icon
            size={32}
            icon="Loader"
            className="animate-spin hidden sm:block"
          />
          <Icon
            size={24}
            icon="Loader"
            className="animate-spin block sm:hidden"
          />
        </>
      ) : (
        <>
          <Icon size={32} icon="Plus" className="hidden sm:block" />
          <Icon size={24} icon="Plus" className="block sm:hidden" />
        </>
      )}
      <span className="sr-only">Create new note</span>
    </Button>
  );
}
