import Button from "components/Button";
import Dialog from "components/Dialog";
import Input from "components/Input";
import useSearchParams from "hooks/useSearchParams";
import { SyntheticEvent, useState } from "react";

type Props = {
  isOpen?: boolean;
  onClose: () => void;
};

export default function FilterDialog({ isOpen = false, onClose }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.q || "");

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();

    setSearchParams({
      q: keyword || undefined,
    });

    onClose();
  }

  return (
    <Dialog onClose={onClose} isOpen={isOpen} title="Filter">
      <Dialog.Content>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label
              className="text-sm text-gray-500 block mb-1"
              htmlFor="filter--keyword"
            >
              By keyword
            </label>
            <Input
              id="filter--keyword"
              onChange={(e) => setKeyword(e.target.value)}
              value={keyword}
            />
          </div>
          <Button type="submit" options={{ fluid: true }}>
            Apply filters
          </Button>
        </form>
      </Dialog.Content>
    </Dialog>
  );
}
