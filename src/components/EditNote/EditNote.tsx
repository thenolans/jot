import { Button, Icon } from "@thenolans/nolan-ui";
import Modal from "components/Modal";
import NoteEditor from "components/NoteEditor";
import { ROUTE_PATHS } from "constants/urls";
import useNotes from "hooks/useNotes";
import { throttle } from "lodash";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditNote() {
  const { id } = useParams();
  const noteIdToEdit = parseInt(id || "");
  const { notes, isFetching, updateNote } = useNotes();
  const navigate = useNavigate();

  const noteToEdit = notes.find((note) => note.id === noteIdToEdit);
  const throttleUpdateNote = useMemo(() => throttle(updateNote, 1000), []); // eslint-disable-line react-hooks/exhaustive-deps

  const closeEditModal = useCallback(() => {
    navigate(ROUTE_PATHS.notes);
  }, [navigate]);

  useEffect(() => {
    // Wait until we're done fetching
    if (isFetching) return;

    if (!noteIdToEdit || !noteToEdit) {
      closeEditModal();
    }
  }, [noteIdToEdit, navigate, noteToEdit, isFetching, closeEditModal]);

  if (!noteToEdit) return null;

  return (
    <Modal isOpen onClose={() => closeEditModal()} ariaLabel="Edit Note">
      <Modal.Scroll>
        <NoteEditor
          defaultContent={noteToEdit.content}
          onChange={(newContent) => {
            throttleUpdateNote(noteIdToEdit, { content: newContent.trim() });
          }}
        />
      </Modal.Scroll>
      <Modal.Footer className="flex items-center justify-between">
        <Button aria-label="Delete note" onClick={() => {}} theme="tertiary">
          <Icon size={16} icon="Trash" />
        </Button>
        <Button
          className="text-sm"
          onClick={() => closeEditModal()}
          theme="tertiary"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
