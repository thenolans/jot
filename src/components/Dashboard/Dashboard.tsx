import Button from "components/Button";
import Entries from "components/Entries";
import FilterDialog from "components/FilterDialog";
import Layout from "components/Layout";
import { EntriesProvider } from "contexts/entries";
import FilterIcon from "icons/Filter";
import PlusIcon from "icons/Plus";
import { useState } from "react";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Layout>
      <EntriesProvider>
        <div className="pb-4">
          <Entries />
        </div>
        <div className="fixed bottom-0 left-0 w-full p-2">
          <div className="flex justify-between">
            <Button onClick={() => setIsOpen(true)} className="w-12 shadow">
              <FilterIcon />
              <span className="sr-only">Filters</span>
            </Button>
            <Button className="w-12 space-x-2">
              <PlusIcon />
              <span className="sr-only">Add entry</span>
            </Button>
          </div>
        </div>
        <FilterDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </EntriesProvider>
    </Layout>
  );
}
