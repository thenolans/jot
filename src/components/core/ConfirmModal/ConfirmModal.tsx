import BodyText from "components/core/BodyText";
import Button from "components/core/Button";
import Heading from "components/core/Heading";
import Input from "components/core/Input";
import Label from "components/core/Label";
import Modal, { ModalProps } from "components/core/Modal";
import { useEffect, useState } from "react";

type Props = Omit<ModalProps, "children"> & {
  onConfirm: () => void;
  typeConfirm?: string;
  description?: string;
  theme?: "default" | "danger";
};

export default function ConfirmModal({
  title,
  onConfirm,
  typeConfirm,
  description,
  theme = "default",
  ...props
}: Props) {
  const [confirmValue, setConfirmValue] = useState("");

  useEffect(() => {
    if (!props.isOpen) {
      setConfirmValue("");
    }
  }, [props.isOpen]);

  return (
    <Modal hideClose {...props}>
      <Modal.Body>
        <div className="py-2 space-y-8 md:px-8">
          <Heading theme={theme} as="h3" className="text-center md:px-8">
            {title}
          </Heading>
          {description && <BodyText>{description}</BodyText>}
          {typeConfirm && (
            <div>
              <Label htmlFor="confirm-delete-input">
                Type "{typeConfirm}" to proceed
              </Label>
              <Input
                id="confirm-delete-input"
                value={confirmValue}
                onChange={(e) => setConfirmValue(e.target.value)}
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={props.onClose} theme="link-muted">
              Cancel
            </Button>
            <Button
              disabled={Boolean(typeConfirm && typeConfirm !== confirmValue)}
              theme="danger"
              onClick={onConfirm}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
