import { useQuery } from "@tanstack/react-query";
import { BuiltByTheNolans } from "@thenolans/nolan-ui";
import { fetchNotes } from "api/notes";
import AddNoteButton from "components/AddNoteButton";
import NavBar from "components/NavBar";
import NoteGrid from "components/NoteGrid";
import { Note, QueryKeys } from "types";

function App() {
  const { data = [] } = useQuery<Note[]>({
    queryKey: [QueryKeys.NOTES],
    queryFn: fetchNotes,
  });

  return (
    <div className="container mx-auto max-w-5xl py-8 space-y-8 px-2 sm:px-4">
      <NavBar />
      <NoteGrid notes={data} />
      <AddNoteButton />
      <BuiltByTheNolans />
    </div>
  );
}

export default App;
