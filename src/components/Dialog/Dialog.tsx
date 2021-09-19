import { Dialog as ReachDialog } from "@reach/dialog";
import Button from "components/Button";
import Container from "components/Container";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  isOpen?: boolean;
  onClose: () => void;
  title: string;
  ariaLabel: string;
};

const Dialog = ({
  children,
  isOpen = false,
  onClose,
  title,
  ariaLabel,
}: Props) => {
  if (!isOpen) return null;

  return (
    <ReachDialog
      className="fixed bottom-0 left-0 w-full h-full bg-white overflow-hidden"
      isOpen={isOpen}
      onDismiss={onClose}
      aria-label={ariaLabel}
    >
      <div className="flex flex-col overflow-hidden h-full">
        <div className="border-b-2 border-gray-100 font-semibold px-4">
          <Container>
            <div className="flex justify-between text-lg text-gray-700">
              {title}
              <Button onClick={onClose} theme="mutedLink">
                <i className="fa fa-close" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </Container>
        </div>
        {children}
      </div>
    </ReachDialog>
  );
};

Dialog.Content = ({ children }: { children: ReactNode }) => {
  return (
    <div className="overflow-y-auto flex-auto p-4">
      <Container>{children}</Container>
    </div>
  );
};

Dialog.Footer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="border-t-2 border-gray-100 px-4">
      <Container>{children}</Container>
    </div>
  );
};

export default Dialog;
