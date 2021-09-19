import Button from "components/Button";
import Container from "components/Container";
import CreateDialog from "components/CreateDialog";
import EditDialog from "components/EditDialog";
import FilterDialog from "components/FilterDialog";
import Icon from "components/Icon";
import SROnly from "components/SROnly";
import useEntries from "hooks/useEntries";
import { DialogKeys } from "types";

export default function FloatingButtons() {
  const { activeDialog, setActiveDialog } = useEntries();

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full py-4">
        <Container>
          <div className="flex justify-between px-2">
            <Button
              onClick={() => setActiveDialog(DialogKeys.FILTER)}
              className="w-12 shadow"
            >
              <Icon variant="fa-filter" />
              <SROnly>Filters</SROnly>
            </Button>
            <Button
              onClick={() => setActiveDialog(DialogKeys.CREATE)}
              className="w-12 space-x-2"
            >
              <Icon variant="fa-plus" />
              <SROnly>Add entry</SROnly>
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
      <EditDialog
        isOpen={activeDialog === DialogKeys.EDIT}
        onClose={() => setActiveDialog(null)}
      />
    </>
  );
}
