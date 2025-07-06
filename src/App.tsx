import { BuiltByTheNolans } from "@thenolans/nolan-ui";
import AddNoteButton from "components/AddNoteButton";
import NavBar from "components/NavBar";
import NoteGrid from "components/NoteGrid";
import NotesContextProvider from "contexts/notesContext";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <NotesContextProvider>
      <div className="container mx-auto max-w-5xl py-8 space-y-8 px-2 sm:px-4">
        <NavBar />
        <NoteGrid />
        <AddNoteButton />
        <BuiltByTheNolans />
      </div>
      <Outlet />
    </NotesContextProvider>
  );
}

export default App;
