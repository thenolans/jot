import "./Modal.css";

import { Dialog } from "@reach/dialog";
import classNames from "classnames";
import Container from "components/core/Container";
import Heading from "components/core/Heading";
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

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="absolute right-4 md:right-0 top-0 text-white bg-primary-500 hover:bg-primary-600 rounded-full w-8 h-8 flex items-center justify-center transform md:translate-x-1/3 md:-translate-y-1/3 -translate-y-1/2"
      type="button"
      onClick={onClick}
    >
      <Icon size={16} icon={Close} />
    </button>
  );
}

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
          <Heading as="h3">{title}</Heading>
          {!hideClose && <CloseButton onClick={() => onClose()} />}
        </div>
      )}
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

Modal.Scroll = ({ children, className }: ComponentPropsWithoutRef<"div">) => {
  return (
    <div className={classNames("c-modal__scroll", className)}>{children}</div>
  );
};

Modal.Footer = ({ children, className }: ComponentPropsWithoutRef<"div">) => {
  return (
    <div className={classNames("c-modal__footer", className)}>{children}</div>
  );
};

Modal.CloseButton = CloseButton;

export default Modal;
