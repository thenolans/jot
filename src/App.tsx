import { BuiltByTheNolans } from "@thenolans/nolan-ui";
import AddNoteButton from "components/AddNoteButton";
import EditNote from "components/EditNote";
import FolderList from "components/FolderList";
import NavBar from "components/NavBar";
import NoteList from "components/NoteList";
import NoteSearch from "components/NoteSearch";
import FolderContextProvider from "contexts/folderContext";
import NotesContextProvider from "contexts/notesContext";
import { useSearchParams } from "react-router-dom";

function App() {
  const versionNumber = process.env.REACT_APP_VERSION;
  const [searchParams] = useSearchParams();
  const editingNoteId = searchParams.get("editing_note_id");

  return (
    <NotesContextProvider>
      <FolderContextProvider>
        <NavBar />
        <div className="container mx-auto max-w-5xl py-4 sm:py-8 space-y-4 sm:space-y-8 px-2 sm:px-4">
          <NoteSearch />
          <FolderList />
          <NoteList />
          <AddNoteButton />
          <div className="space-y-1">
            <BuiltByTheNolans />
            {versionNumber && (
              <div className="text-gray-500 text-sm text-center">
                {versionNumber}
              </div>
            )}
          </div>
        </div>
        {editingNoteId && <EditNote />}
      </FolderContextProvider>
    </NotesContextProvider>
  );
}

export default App;
