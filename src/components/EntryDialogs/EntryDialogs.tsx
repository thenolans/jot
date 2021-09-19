import Button from "components/Button";
import Container from "components/Container";
import CreateDialog from "components/CreateDialog";
import FilterDialog from "components/FilterDialog";
import useEntries from "hooks/useEntries";
import { DialogKeys } from "types";

export default function FloatingButtons() {
  const { activeDialog, setActiveDialog } = useEntries();

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full p-2">
        <Container>
          <div className="flex justify-between">
            <Button
              onClick={() => setActiveDialog(DialogKeys.FILTER)}
              className="w-12 shadow"
            >
              <i aria-hidden="true" className="fa fa-filter" />
              <span className="sr-only">Filters</span>
            </Button>
            <Button
              onClick={() => setActiveDialog(DialogKeys.CREATE)}
              className="w-12 space-x-2"
            >
              <i aria-hidden="true" className="fa fa-plus" />
              <span className="sr-only">Add entry</span>
            </Button>
          </div>
        </Container>
      </div>
      <FilterDialog
        isOpen={activeDialog === DialogKeys.FILTER}
        onClose={() => setActiveDialog(null)}
      />
      <CreateDialog
        isOpen={activeDialog === DialogKeys.CREATE}
        onClose={() => setActiveDialog(null)}
      />
    </>
  );
}
