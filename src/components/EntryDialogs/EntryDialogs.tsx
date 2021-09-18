import Button from "components/Button";
import CreateDialog from "components/CreateDialog";
import FilterDialog from "components/FilterDialog";
import useEntries from "hooks/useEntries";
import FilterIcon from "icons/Filter";
import PlusIcon from "icons/Plus";

export default function FloatingButtons() {
  const { activeDialog, setActiveDialog } = useEntries();

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full p-2">
        <div className="flex justify-between">
          <Button
            onClick={() => setActiveDialog("filter")}
            className="w-12 shadow"
          >
            <FilterIcon />
            <span className="sr-only">Filters</span>
          </Button>
          <Button
            onClick={() => setActiveDialog("create")}
            className="w-12 space-x-2"
          >
            <PlusIcon />
            <span className="sr-only">Add entry</span>
          </Button>
        </div>
      </div>
      <FilterDialog
        isOpen={activeDialog === "filter"}
        onClose={() => setActiveDialog(null)}
      />
      <CreateDialog
        isOpen={activeDialog === "create"}
        onClose={() => setActiveDialog(null)}
      />
    </>
  );
}
