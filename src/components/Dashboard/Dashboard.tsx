import AddIcon from "components/AddIcon";
import Container from "components/Container";
import Entries from "components/Entries";
import FilterIcon from "components/FilterIcon";
import Header from "components/Header";

export default function Dashboard() {
  return (
    <div className="pb-8">
      <Container>
        <Header />
        <Entries />
      </Container>
      <div className="fixed bottom-0 left-0 w-full">
        <Container>
          <div className="flex justify-between mx-2">
            <button className="shadow w-12 h-12 flex justify-center items-center bg-yellow-600 text-white rounded-lg">
              <FilterIcon />
              <span className="sr-only">Filters</span>
            </button>
            <button className="shadow w-12 h-12 flex justify-center items-center bg-yellow-600 text-white rounded-lg">
              <AddIcon />
              <span className="sr-only">Add entry</span>
            </button>
          </div>
        </Container>
      </div>
    </div>
  );
}
