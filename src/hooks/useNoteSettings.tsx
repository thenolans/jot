import NoteSettingsContext from "contexts/noteSettings";
import { useContext } from "react";

export default function useNoteSettings() {
  return useContext(NoteSettingsContext);
}
