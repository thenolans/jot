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
};

export default function EditNoteModal({
  note,
  onUpdate,
  onClose,
  ...props
}: Props) {
  const [content, setContent] = useState(note.content);

  const throttleSave = useMemo(() => throttle(saveContentUpdate, 1000), []);

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
    saveContentUpdate(note._id, content);
    onClose();
  }

  return (
    <Modal ariaLabel="Edit note" onClose={() => handleClose()} {...props}>
      <Modal.Body>
        <Textarea autoFocus value={content} onChange={handleChange} />
      </Modal.Body>
    </Modal>
  );
}
