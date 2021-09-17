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
          <button className="shadow w-12 h-12 flex justify-center items-center bg-yellow-600 text-white rounded-lg">
            <FilterIcon />
            <span className="sr-only">Filters</span>
          </button>
          <button className="shadow w-12 h-12 flex justify-center items-center bg-yellow-600 text-white rounded-lg">
            <PlusIcon />
            <span className="sr-only">Add entry</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}
