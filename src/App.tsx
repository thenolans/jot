import { BuiltByTheNolans, Button, Icon } from "@thenolans/nolan-ui";
import classNames from "classnames";
import AddNoteButton from "components/AddNoteButton";
import EditNote from "components/EditNote";
import FolderList from "components/FolderList";
import NavBar from "components/NavBar";
import NoteList from "components/NoteList";
import NoteSearch from "components/NoteSearch";
import FolderContextProvider from "contexts/folderContext";
import NotesContextProvider from "contexts/notesContext";
import { useState } from "react";
import AnimateHeight from "react-animate-height";
import { useSearchParams } from "react-router-dom";

function App() {
  const versionNumber = process.env.REACT_APP_VERSION;
  const [searchParams] = useSearchParams();
  const editingNoteId = searchParams.get("editing_note_id");
  const [isShowingFolders, setIsShowingFolders] = useState(false);

  return (
    <NotesContextProvider>
      <NavBar />
      <div className="max-w-5xl mx-auto container py-4 sm:py-8 space-y-4 sm:space-y-8 px-2 sm:px-4">
        <div className="flex items-center space-x-2 sm:max-w-96 mx-auto">
          <NoteSearch />
          <div className="block sm:hidden">
            <Button onClick={() => setIsShowingFolders(!isShowingFolders)}>
              <Icon icon="Folder" />
            </Button>
          </div>
        </div>
        <FolderContextProvider>
          <div className="sm:hidden">
            <AnimateHeight
              duration={250}
              height={isShowingFolders ? "auto" : 0}
            >
              <FolderList />
            </AnimateHeight>
          </div>
          <div className="hidden sm:block">
            <FolderList />
          </div>
        </FolderContextProvider>
        <NoteList />
        <AddNoteButton />
      </div>
      {editingNoteId && <EditNote />}
      <div className="space-y-1">
        <BuiltByTheNolans />
        {versionNumber && (
          <div className="text-gray-500 text-sm text-center">
            {versionNumber}
          </div>
        )}
      </div>
    </NotesContextProvider>
  );
}

export default App;
