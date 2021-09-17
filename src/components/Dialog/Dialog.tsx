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
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow rounded-t-2xl p-4 max-h-96">
      <div className="flex justify-between font-semibold text-lg text-gray-700 mb-4">
        {title}
        <Button onClick={onClose} theme="mutedLink">
          <CloseIcon />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <div>{children}</div>
    </div>
  );
}
