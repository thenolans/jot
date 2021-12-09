import { Dialog } from "@reach/dialog";
import { deleteNote as deleteNoteApi, updateNote } from "api/notes";
import Button from "components/core/Button";
import Checkbox from "components/core/Checkbox";
import Icon, { Trash } from "components/core/Icon";
import Modal, { ModalProps } from "components/core/Modal";
import Tooltip from "components/core/Tooltip";
import throttle from "lodash/throttle";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
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

  const textareaRef = useCallback((node) => {
    if (node !== null) {
      node.setSelectionRange(note.content.length, note.content.length);
      node.scrollTop = node.scrollHeight;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    throttleSave(note._id, e.target.value.trim());
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
    <Dialog
      className="c-modal c-modal--stretch"
      isOpen={props.isOpen}
      onDismiss={() => onClose()}
      aria-label="Edit note"
    >
      <Modal.CloseButton onClick={() => handleClose()} />
      <Modal.Scroll>
        <textarea
          ref={textareaRef}
          autoFocus
          className="w-full resize-none p-6 flex-grow outline-none text-gray-700"
          value={content}
          onChange={handleChange}
        />

        <Modal.Footer className="flex items-center justify-between">
          <Checkbox
            size="sm"
            onChange={(e) => {
              togglePrivate(e.target.checked);
              setIsPrivate(e.target.checked);
            }}
            label="Scramble note in list view?"
            checked={isPrivate}
          />
          <Tooltip title="Delete note">
            <Button
              aria-label="Delete note"
              onClick={() => deleteNote()}
              theme="link-primary"
            >
              <Icon size={16} icon={Trash} />
            </Button>
          </Tooltip>
        </Modal.Footer>
      </Modal.Scroll>
    </Dialog>
  );
}
