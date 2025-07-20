import { useQuery } from "@tanstack/react-query";
import { Button, Icon } from "@thenolans/nolan-ui";
import { getNote } from "api/notes";
import Modal from "components/Modal";
import NoteEditor from "components/NoteEditor";
import PinNoteButton from "components/PinNoteButton";
import { ROUTE_PATHS } from "constants/urls";
import useNotes from "hooks/useNotes";
import { throttle } from "lodash";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Note, QueryKeys } from "types";

const AUTO_FOCUS_THRESHOLD = 640;

export default function EditNote() {
  const { id } = useParams();
  const noteIdToEdit = parseInt(id || "");
  const { updateNote, removeNote, getNoteById } = useNotes();
  const noteFromContext = getNoteById(noteIdToEdit);
  const { data: fetchedNote, isFetching } = useQuery<Note>({
    queryKey: [QueryKeys.NOTE, noteIdToEdit],
    queryFn: getNote,
    enabled: !noteFromContext,
  });
  const note = noteFromContext || fetchedNote;

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
    if (!isFetching && !note) {
      closeEditModal();
    }
  }, [isFetching, note, closeEditModal]);

  if (!note || isFetching) return null;

  return (
    <Modal isOpen onClose={() => closeEditModal()} ariaLabel="Edit Note">
      <Modal.Header>
        <div className="px-4 translate-x-4">
          <PinNoteButton isPinned={note.is_pinned} noteId={note.id} />
        </div>
      </Modal.Header>
      <Modal.Scroll>
        <NoteEditor
          shouldAutoFocus={shouldAutoFocusEditor}
          defaultContent={note.content}
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
