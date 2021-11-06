import Button from "components/core/Button";
import Modal, { ModalProps } from "components/core/Modal";
import Textarea from "components/core/Textarea";
import Urls from "constants/urls";
import throttle from "lodash/throttle";
import { reverse } from "named-urls";
import { ChangeEvent, useMemo, useState } from "react";
import { Note } from "types";
import http from "utils/http";

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

  const throttleSave = useMemo(() => throttle(saveContentUpdate, 1000), []); // eslint-disable-line react-hooks/exhaustive-deps

  async function saveContentUpdate(noteId: string, content: string) {
    const updatedNote = await http
      .patch(reverse(Urls.api["notes:details"], { id: noteId }), {
        content,
      })
      .then((res) => res.data.data);
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
      await http.delete(
        reverse(Urls.api["notes:details"], {
          id: note._id,
        })
      );
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
        <Textarea autoFocus value={content} onChange={handleChange} />
        <div className="mt-4 text-center">
          <Button theme="link--danger" onClick={() => deleteNote()}>
            <i className="fa fa-trash" />
            <span>Delete note</span>
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
