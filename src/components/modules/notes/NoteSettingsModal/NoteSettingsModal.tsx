import Button from "components/core/Button";
import Checkbox from "components/core/Checkbox";
import Modal, { ModalProps } from "components/core/Modal";
import useNoteSettings from "hooks/useNoteSettings";

type Props = Pick<ModalProps, "isOpen" | "onClose">;

export default function NoteSettingsModal(props: Props) {
  const { scramblePrivateNotes, setScramblePrivateNotes } = useNoteSettings();

  return (
    <Modal ariaLabel="Edit note settings" title="Note settings" {...props}>
      <Modal.Body>
        <Checkbox
          label="Scramble private notes in list view?"
          checked={scramblePrivateNotes}
          onChange={(e) => setScramblePrivateNotes(e.target.checked)}
        />
      </Modal.Body>
      <Modal.Footer className="text-right">
        <Button onClick={() => props.onClose()}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
