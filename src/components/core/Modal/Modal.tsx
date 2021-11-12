import "./Modal.css";

import { Dialog } from "@reach/dialog";
import classNames from "classnames";
import Button from "components/core/Button";
import Container from "components/core/Container";
import Icon, { Close } from "components/core/Icon";
import { ComponentPropsWithoutRef, ReactNode } from "react";

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
      <Container>
        {(title || !hideClose) && (
          <div className="c-modal__header">
            <div className="text-xl text-primary-700 font-semibold">
              {title}
            </div>
            {!hideClose && (
              <Button
                aria-label="Close"
                onClick={() => onClose()}
                theme="link--muted"
              >
                <Icon icon={Close} />
              </Button>
            )}
          </div>
        )}
      </Container>
      {children}
    </Dialog>
  );
};

Modal.Body = ({ children, className }: ComponentPropsWithoutRef<"div">) => {
  return (
    <div className={classNames("c-modal__body", className)}>
      <Container>{children}</Container>
    </div>
  );
};

Modal.Footer = ({ children, className }: ComponentPropsWithoutRef<"div">) => {
  return (
    <div className={classNames("c-modal__footer", className)}>
      <Container>{children}</Container>
    </div>
  );
};

export default Modal;
