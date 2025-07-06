import { NotesContext } from "contexts/notesContext";
import { useContext } from "react";

export const useNotes = () => useContext(NotesContext);

export default useNotes;
