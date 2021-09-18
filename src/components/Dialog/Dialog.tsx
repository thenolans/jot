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

export default function Dialog({
  children,
  isOpen = false,
  onClose,
  title,
}: Props) {
  return (
    <ReachDialog
      className="fixed bottom-0 left-0 w-full h-full bg-white"
      isOpen={isOpen}
      onDismiss={onClose}
    >
      <div className="p-4">
        <div className="flex justify-between font-semibold text-lg text-gray-700 mb-4">
          {title}
          <Button onClick={onClose} theme="mutedLink">
            <CloseIcon />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <div>{children}</div>
      </div>
    </ReachDialog>
  );
}
