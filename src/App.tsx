import { BuiltByTheNolans } from "@thenolans/nolan-ui";
import AddNoteButton from "components/AddNoteButton";
import NavBar from "components/NavBar";
import NoteGrid from "components/NoteGrid";

function App() {
  return (
    <div className="container mx-auto max-w-5xl py-8 space-y-8">
      <NavBar />
      <NoteGrid />
      <AddNoteButton />
      <BuiltByTheNolans />
    </div>
  );
}

export default App;
