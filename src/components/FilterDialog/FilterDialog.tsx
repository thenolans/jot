import Dialog from "components/Dialog";
import Input from "components/Input";

type Props = {
  isOpen?: boolean;
  onClose: () => void;
};

export default function FilterDialog({ isOpen = false, onClose }: Props) {
  return (
    <Dialog onClose={onClose} isOpen={isOpen} title="Filter">
      <Input placeholder="By keyword..." />
    </Dialog>
  );
}
