import { Button, Icon } from "@thenolans/nolan-ui";
import Modal from "components/Modal";
import NoteEditor from "components/NoteEditor";
import { ROUTE_PATHS } from "constants/urls";
import useNotes from "hooks/useNotes";
import { throttle } from "lodash";
import { useCallback, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function EditNote() {
  const { id } = useParams();
  const location = useLocation();
  const { noteContent } = location.state || {};
  const noteIdToEdit = parseInt(id || "");
  const { updateNote } = useNotes();
  const navigate = useNavigate();

  const throttleUpdateNote = useMemo(() => throttle(updateNote, 1000), []); // eslint-disable-line react-hooks/exhaustive-deps

  const closeEditModal = useCallback(() => {
    navigate(ROUTE_PATHS.notes);
  }, [navigate]);

  return (
    <Modal isOpen onClose={() => closeEditModal()} ariaLabel="Edit Note">
      <Modal.Scroll>
        <NoteEditor
          defaultContent={noteContent}
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
