import Entries from "components/Entries";
import EntryDialogs from "components/EntryDialogs";
import Layout from "components/Layout";
import { EntriesProvider } from "contexts/entries";

export default function Dashboard() {
  return (
    <Layout>
      <EntriesProvider>
        <div className="pb-4">
          <Entries />
        </div>
        <EntryDialogs />
      </EntriesProvider>
    </Layout>
  );
}
