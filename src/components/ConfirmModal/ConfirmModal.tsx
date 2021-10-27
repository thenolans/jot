import Button from "components/Button";
import Modal, { ModalProps } from "components/Modal";

type Props = Omit<ModalProps, "children"> & {
  onConfirm: () => void;
};

export default function ConfirmModal({ title, onConfirm, ...props }: Props) {
  return (
    <Modal hideClose {...props}>
      <div className="text-center py-2 space-y-6">
        <div>{title}</div>
        <div className="space-x-6">
          <Button onClick={props.onClose} theme="link--muted">
            Cancel
          </Button>
          <Button theme="danger" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
}
