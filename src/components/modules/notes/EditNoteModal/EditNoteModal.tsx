import { deleteNote as deleteNoteApi, updateNote } from "api/notes";
import Checkbox from "components/core/Checkbox";
import DeleteButton from "components/core/DeleteButton";
import Modal, { ModalProps } from "components/core/Modal";
import Textarea from "components/core/Textarea";
import throttle from "lodash/throttle";
import { ChangeEvent, useMemo, useState } from "react";
import { Note } from "types";

type Props = Pick<ModalProps, "isOpen" | "onClose"> & {
  note: Note;
  onUpdate: (note: Note) => void;
  onDelete: (noteId: string) => void;
};

export default function EditNoteModal({
  onDelete,
  note,
  onUpdate,
  onClose,
  ...props
}: Props) {
  const [content, setContent] = useState(note.content);
  const [shouldScrambleContent, setShouldScrambleContent] = useState(
    note.scrambleContent
  );

  const throttleSave = useMemo(() => throttle(saveContentUpdate, 1000), []); // eslint-disable-line react-hooks/exhaustive-deps

  async function saveContentUpdate(noteId: string, content: string) {
    const updatedNote = await updateNote(noteId, { content });
    onUpdate(updatedNote);
  }

  async function toggleScrambleContent(checked: boolean) {
    const updatedNote = await updateNote(note._id, {
      scrambleContent: checked,
    });

    onUpdate(updatedNote);
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);
    throttleSave(note._id, e.target.value);
  }

  function handleClose() {
    if (content !== note.content) {
      saveContentUpdate(note._id, content);
    }
    onClose();
  }

  async function deleteNote() {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await deleteNoteApi(note._id);
      onDelete(note._id);
      onClose();
    }
  }

  return (
    <Modal
      title="Edit note"
      ariaLabel="Edit note"
      onClose={() => handleClose()}
      {...props}
    >
      <Modal.Body>
        <div className="space-y-4">
          <Checkbox
            onChange={(e) => {
              toggleScrambleContent(e.target.checked);
              setShouldScrambleContent(e.target.checked);
            }}
            checked={shouldScrambleContent}
            label="Scramble content in list view"
          />
          <Textarea autoFocus value={content} onChange={handleChange} />
        </div>
      </Modal.Body>
      <Modal.Footer className="text-center">
        <DeleteButton onClick={() => deleteNote()}>Delete note</DeleteButton>
      </Modal.Footer>
    </Modal>
  );
}
