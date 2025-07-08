import { Dialog } from "@reach/dialog";
import classNames from "classnames";
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
  ariaLabel,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <Dialog
      className="relative w-full bg-white shadow h-full md:h-auto md:max-h-full md:max-w-md md:rounded-xl flex flex-col"
      isOpen={isOpen}
      onDismiss={() => onClose()}
      aria-label={ariaLabel}
    >
      {children}
    </Dialog>
  );
};

Modal.Scroll = ({ children, className }: ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      className={classNames(
        "overflow-hidden flex-grow flex flex-col md:rounded-xl",
        className
      )}
    >
      {children}
    </div>
  );
};

Modal.Footer = ({ children, className }: ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      className={classNames("border-t-2 border-gray-100 py-4 px-6", className)}
    >
      {children}
    </div>
  );
};

export default Modal;
