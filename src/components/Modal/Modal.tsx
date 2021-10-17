import "./Modal.css";

import { Dialog } from "@reach/dialog";
import Button from "components/Button";
import Icon from "components/Icon";
import SROnly from "components/SROnly";
import { ReactNode } from "react";

export type ModalProps = {
  children: ReactNode;
  isOpen?: boolean;
  onClose: () => void;
  title?: string;
  ariaLabel: string;
  hideClose?: boolean;
};

const Modal = ({
  children,
  isOpen = false,
  onClose,
  title,
  ariaLabel,
  hideClose,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <Dialog
      className="c-modal"
      isOpen={isOpen}
      onDismiss={() => onClose()}
      aria-label={ariaLabel}
    >
      {(title || !hideClose) && (
        <div className="c-modal__header">
          <div className="text-xl text-primary-700 font-semibold">{title}</div>
          {!hideClose && (
            <Button onClick={() => onClose()} theme="link--muted">
              <Icon variant="fa-close" />
              <SROnly>Close</SROnly>
            </Button>
          )}
        </div>
      )}
      {children}
    </Dialog>
  );
};

Modal.Body = ({ children }: { children: ReactNode }) => {
  return <div className="c-modal__body">{children}</div>;
};

Modal.Footer = ({ children }: { children: ReactNode }) => {
  return <div className="c-modal__footer">{children}</div>;
};

export default Modal;
