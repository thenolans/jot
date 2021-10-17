import Button from "components/Button";
import JournalLink from "components/JournalLink";
import Layout from "components/Layout";
import PageTitle from "components/PageTitle";

const JOURNALS = [
  { id: "1", title: "Food & Drinks" },
  { id: "2", title: "Daily reflections" },
  { id: "3", title: "Switzerland trip" },
  { id: "4", title: "Greece trip" },
  { id: "5", title: "Hiking log" },
];

export default function JournalList() {
  return (
    <Layout>
      <div className="space-y-16">
        <div className="flex justify-between items-center">
          <PageTitle>Journals</PageTitle>
          <Button>Create journal</Button>
        </div>
        <div className="grid grid-cols-4 gap-16">
          {JOURNALS.map(({ id, title }) => {
            return <JournalLink id={id} key={id} title={title} />;
          })}
        </div>
      </div>
    </Layout>
  );
}
