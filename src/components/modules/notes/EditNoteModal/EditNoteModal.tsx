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
  const [isPrivate, setIsPrivate] = useState(note.isPrivate);

  const throttleSave = useMemo(() => throttle(saveContentUpdate, 1000), []); // eslint-disable-line react-hooks/exhaustive-deps

  async function saveContentUpdate(noteId: string, content: string) {
    const updatedNote = await updateNote(noteId, { content });
    onUpdate(updatedNote);
  }

  async function togglePrivate(checked: boolean) {
    const updatedNote = await updateNote(note._id, {
      isPrivate: checked,
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
        <Textarea
          className="min-h-48"
          autoFocus
          value={content}
          onChange={handleChange}
        />
      </Modal.Body>
      <Modal.Footer className="text-center">
        <div className="grid grid-cols-2 gap-2">
          <Checkbox
            onChange={(e) => {
              togglePrivate(e.target.checked);
              setIsPrivate(e.target.checked);
            }}
            checked={isPrivate}
            label="Private?"
          />
          <DeleteButton onClick={() => deleteNote()}>Delete note</DeleteButton>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
