import Button from "components/Button";
import Layout from "components/Layout";
import PageTitle from "components/PageTitle";

// function fetchNotes(): Promise<Journal[]> {
//   return http.get(Urls.api["notes:list"]).then((res) => res.data.data);
// }

export default function Lists() {
  // const { data = [], isLoading } = useQuery("journal-list", fetchJournals);

  return (
    <Layout>
      <div className="space-y-8 lg:space-y-16">
        <div className="flex justify-between items-center">
          <PageTitle>Lists</PageTitle>
          <Button>Create list</Button>
        </div>
      </div>
    </Layout>
  );
}
