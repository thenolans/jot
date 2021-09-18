import { Dialog as ReachDialog } from "@reach/dialog";
import Button from "components/Button";
import CloseIcon from "icons/Close";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  isOpen?: boolean;
  onClose: () => void;
  title: string;
};

const Dialog = ({ children, isOpen = false, onClose, title }: Props) => {
  return (
    <ReachDialog
      className="fixed bottom-0 left-0 w-full h-full bg-white overflow-hidden"
      isOpen={isOpen}
      onDismiss={onClose}
    >
      <div className="flex flex-col overflow-hidden h-full">
        <div className="border-b-2 border-gray-100 p-4 flex justify-between font-semibold text-lg text-gray-700">
          {title}
          <Button onClick={onClose} theme="mutedLink">
            <CloseIcon />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        {children}
      </div>
    </ReachDialog>
  );
};

Dialog.Content = ({ children }: { children: ReactNode }) => {
  return <div className="overflow-y-auto flex-auto p-4">{children}</div>;
};

Dialog.Footer = ({ children }: { children: ReactNode }) => {
  return <div className="p-4 border-t-2 border-gray-100">{children}</div>;
};

export default Dialog;
