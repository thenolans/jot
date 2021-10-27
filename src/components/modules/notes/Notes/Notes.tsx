import Button from "components/core/Button";
import Layout from "components/core/Layout";
import PageTitle from "components/core/PageTitle";

import MasonryGrid from "../MasonryGrid";
import Note from "./Note";

// function fetchNotes(): Promise<Journal[]> {
//   return http.get(Urls.api["notes:list"]).then((res) => res.data.data);
// }

export default function Notes() {
  // const { data = [], isLoading } = useQuery("journal-list", fetchJournals);

  return (
    <Layout>
      <div className="space-y-8 lg:space-y-16">
        <div className="flex justify-between items-center">
          <PageTitle>Notes</PageTitle>
          <Button>Create note</Button>
        </div>
        <MasonryGrid>
          <Note>
            Lucas ipsum dolor sit amet moff antilles maul organa mustafar
            antilles solo sebulba obi-wan darth. Hutt kashyyyk ben solo jango
            fett r2-d2 wookiee. Darth lars ackbar darth wampa qui-gonn. Gonk ben
            obi-wan obi-wan jabba mara kessel boba jango .
          </Note>
          <Note>
            Jade moff darth hutt antilles fett r2-d2 organa c-3po. Yavin mon
            luke skywalker. Antilles lars antilles leia skywalker wicket darth
            boba. Windu lobot skywalker solo cade grievous calrissian bespin.
            Mustafar wedge leia obi-wan yoda solo antilles aayla. Jade moff
            sidious jar chewbacca yoda. Chewbacca utapau jango c-3po kenobi moff
            jango dantooine organa. Greedo fisto windu coruscant mandalore
            calrissian. Moff darth vader jade. Hutt mon ewok dooku calamari
            mothma antilles ventress boba. Yavin windu anakin jinn vader.
          </Note>
          <Note>Moff lobot calrissian c-3po jinn.</Note>
          <Note>
            Skywalker qui-gonn moff secura ponda leia jinn moff lobot. Jango
            obi-wan kenobi amidala. Darth ackbar ackbar mandalore fett skywalker
            mothma. Bespin solo obi-wan solo jinn wedge yoda. Ackbar gonk darth
            yoda ackbar dantooine calrissian. Leia luke moff qui-gon. Sidious
            moff leia darth leia hutt skywalker. Yoda windu skywalker darth
            obi-wan kenobi organa. Hutt tusken raider skywalker grievous. Bespin
            coruscant sith gonk chewbacca darth.
          </Note>
          <Note>
            Mara hutt ahsoka leia tatooine hutt organa tatooine organa. Yavin
            skywalker hutt endor alderaan dagobah chewbacca. Hoth wampa padmé
            dantooine mara skywalker tusken raider c-3po fisto. Bespin tatooine
            yavin tusken raider moff wookiee maul cade. Fett qui-gon kashyyyk
            jinn hutt jabba moff jabba. Mara greedo calrissian fett. Fett
            mandalore greedo tatooine baba sebulba gonk skywalker. Wedge
            tatooine darth binks darth. Solo cade hutt lando ventress palpatine
            naboo. Skywalker boba sidious hoth twi'lek.
          </Note>
          <Note>
            Mara hutt ahsoka leia tatooine hutt organa tatooine organa. Yavin
            skywalker hutt endor alderaan dagobah chewbacca. Hoth wampa padmé
            dantooine mara skywalker tusken raider c-3po fisto. Bespin tatooine
            yavin tusken raider moff wookiee maul cade. Fett qui-gon kashyyyk
            jinn hutt jabba moff jabba. Mara greedo calrissian fett. Fett
            mandalore greedo tatooine baba sebulba gonk skywalker. Wedge
            tatooine darth binks darth. Solo cade hutt lando ventress palpatine
            naboo. Skywalker boba sidious hoth twi'lek.
          </Note>
        </MasonryGrid>
      </div>
    </Layout>
  );
}
