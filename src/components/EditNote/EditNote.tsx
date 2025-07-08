import { Button, Icon } from "@thenolans/nolan-ui";
import Modal from "components/Modal";
import NoteEditor from "components/NoteEditor";
import { ROUTE_PATHS } from "constants/urls";
import useNotes from "hooks/useNotes";
import { throttle } from "lodash";
import { useCallback, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const AUTO_FOCUS_THRESHOLD = 640;

export default function EditNote() {
  const { id } = useParams();
  const location = useLocation();
  const { noteContent } = location.state || {};
  const noteIdToEdit = parseInt(id || "");
  const { updateNote, removeNote } = useNotes();
  const navigate = useNavigate();
  const shouldAutoFocusEditor = window.innerWidth > AUTO_FOCUS_THRESHOLD;

  const throttleUpdateNote = useMemo(() => throttle(updateNote, 1000), []); // eslint-disable-line react-hooks/exhaustive-deps

  const closeEditModal = useCallback(() => {
    navigate(ROUTE_PATHS.notes);
  }, [navigate]);

  function handleDelete() {
    if (window.confirm("Are you sure you want to delete this note?")) {
      closeEditModal();
      removeNote(noteIdToEdit);
    }
  }

  useEffect(() => {
    // TODO Handle case where noteContent is not provided (e.g. page refresh)
    if (!noteContent && noteContent !== "") {
      closeEditModal();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal isOpen onClose={() => closeEditModal()} ariaLabel="Edit Note">
      <Modal.Scroll>
        <NoteEditor
          shouldAutoFocus={shouldAutoFocusEditor}
          defaultContent={noteContent}
          onChange={(newContent) => {
            throttleUpdateNote(noteIdToEdit, { content: newContent.trim() });
          }}
        />
      </Modal.Scroll>
      <Modal.Footer className="flex items-center justify-between">
        <Button
          aria-label="Delete note"
          onClick={() => handleDelete()}
          theme="tertiary"
        >
          <Icon size={16} icon="Trash" />
        </Button>
        <Button
          autoFocus={!shouldAutoFocusEditor}
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
