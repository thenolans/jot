import Button from "components/Button";
import Dialog from "components/Dialog";
import Input from "components/Input";
import TagSelect from "components/TagSelect";
import Urls from "constants/urls";
import useSearchParams, { asStringArrayParam } from "hooks/useSearchParams";
import { SyntheticEvent, useState } from "react";
import { useHistory } from "react-router";
import { FilterKeys } from "types";

type Props = {
  isOpen?: boolean;
  onClose: () => void;
};

export default function FilterDialog({ isOpen = false, onClose }: Props) {
  const history = useHistory();
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(
    searchParams[FilterKeys.KEYWORD] || ""
  );
  const appliedTags = asStringArrayParam(searchParams[FilterKeys.TAGS]);
  const [tags, setSelectedTags] = useState(appliedTags);

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();

    setSearchParams({
      [FilterKeys.KEYWORD]: keyword || undefined,
      [FilterKeys.TAGS]: tags,
    });

    onClose();
  }

  function resetFilters() {
    setKeyword("");
    setSelectedTags([]);
    history.push(Urls.routes.app);
    onClose();
  }

  return (
    <Dialog
      ariaLabel="Filter entries by keyword or tag"
      onClose={onClose}
      isOpen={isOpen}
      title="Filter"
    >
      <Dialog.Content>
        <form
          id="filter-entries-form"
          onSubmit={handleSubmit}
          className="space-y-8"
        >
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
          <div>
            <label
              className="text-sm text-gray-500 block mb-1"
              htmlFor="filter--tags"
            >
              By tags
            </label>
            <TagSelect
              inputId="filter--tags"
              onChange={(tags) => setSelectedTags(tags)}
              value={tags}
            />
          </div>
        </form>
      </Dialog.Content>
      <Dialog.Footer>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => resetFilters()} theme="link--muted">
            Reset
          </Button>
          <Button type="submit" form="filter-entries-form" fluid>
            Apply
          </Button>
        </div>
      </Dialog.Footer>
    </Dialog>
  );
}
