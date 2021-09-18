import Entries from "components/Entries";
import EntryDialogs from "components/EntryDialogs";
import Layout from "components/Layout";
import { EntriesProvider } from "contexts/entries";
import { TagProvider } from "contexts/tags";

export default function Dashboard() {
  return (
    <Layout>
      <TagProvider>
        <EntriesProvider>
          <div className="pb-4">
            <Entries />
          </div>
          <EntryDialogs />
        </EntriesProvider>
      </TagProvider>
    </Layout>
  );
}
