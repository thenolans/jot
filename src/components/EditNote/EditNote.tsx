import Modal from "components/Modal";
import NoteEditor from "components/NoteEditor";
import { ROUTE_PATHS } from "constants/urls";
import useNotes from "hooks/useNotes";
import { throttle } from "lodash";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditNote() {
  const { id } = useParams();
  const noteIdToEdit = parseInt(id || "");
  const { notes, isFetching, updateNote } = useNotes();
  const navigate = useNavigate();

  const noteToEdit = notes.find((note) => note.id === noteIdToEdit);
  const throttleUpdateNote = useMemo(() => throttle(updateNote, 1000), []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Wait until we're done fetching
    if (isFetching) return;

    if (!noteIdToEdit || !noteToEdit) {
      navigate(ROUTE_PATHS.notes);
    }
  }, [noteIdToEdit, navigate, noteToEdit, isFetching]);

  if (!noteToEdit) return null;

  return (
    <Modal
      isOpen
      onClose={() => navigate(ROUTE_PATHS.notes)}
      ariaLabel="Edit Note"
    >
      <Modal.Scroll>
        <NoteEditor
          defaultContent={noteToEdit.content}
          onChange={(newContent) => {
            throttleUpdateNote(noteIdToEdit, { content: newContent.trim() });
          }}
        />
      </Modal.Scroll>
    </Modal>
  );
}
