import Button from "components/Button";
import Entries from "components/Entries";
import FilterIcon from "components/FilterIcon";
import Layout from "components/Layout";
import PlusIcon from "icons/Plus";

export default function Dashboard() {
  return (
    <Layout>
      <div className="pb-4">
        <Entries />
      </div>
      <div className="fixed bottom-0 left-0 w-full p-2">
        <div className="flex justify-between">
          <Button className="w-12 shadow">
            <FilterIcon />
            <span className="sr-only">Filters</span>
          </Button>
          <Button className="w-12 space-x-2">
            <PlusIcon />
            <span className="sr-only">Add entry</span>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
