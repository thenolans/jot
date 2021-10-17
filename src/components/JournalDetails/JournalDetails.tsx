import Button from "components/Button";
import Input from "components/Input";
import JournalEntry from "components/JournalEntry";
import Layout from "components/Layout";
import PageTitle from "components/PageTitle";
import TagSelect from "components/TagSelect";
import { TagProvider } from "contexts/tags";

export default function JournalList() {
  return (
    <TagProvider>
      <Layout>
        <div className="space-y-16">
          <PageTitle>Food &amp; Drinks</PageTitle>
          <div className="grid grid-cols-7 gap-4">
            <div className="col-span-4">
              <Input placeholder="Search journal..." className="flex-grow" />
            </div>
            <div className="col-span-2">
              <TagSelect
                placeholder="Filter by tag..."
                inputId=""
                onChange={() => {}}
                value={[]}
              />
            </div>
            <Button className="flex-shrink-0">Log entry</Button>
          </div>
          <div className="bg-primary-100 rounded-r-3xl overflow-hidden">
            <JournalEntry />
            <JournalEntry />
            <JournalEntry />
            <JournalEntry />
            <JournalEntry />
            <JournalEntry />
            <JournalEntry />
            <JournalEntry />
          </div>
        </div>
      </Layout>
    </TagProvider>
  );
}
