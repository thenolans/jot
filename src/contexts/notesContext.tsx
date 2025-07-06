import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNote,
  deleteNote,
  fetchNotes,
  updateNote as updateNoteAPI,
} from "api/notes";
import { createContext, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import {
  Note,
  NotePATCH,
  NotesContext as NotesContextType,
  QueryKeys,
} from "types";

type Props = {
  children: ReactNode;
};

export const NotesContext = createContext<NotesContextType>({
  notes: [],
  isFetching: false,
  updateNote() {},
  removeNote() {},
  appliedFilters: "",
  addNote() {
    return Promise.resolve({
      id: 0,
      content: "",
      created_at: "",
      updated_at: "",
    });
  },
});

export default function NotesContextProvider({ children }: Props) {
  const queryClient = useQueryClient();
  const location = useLocation();
  const appliedFilters = location.search;

  const { data = [], isFetching } = useQuery<Note[]>({
    queryKey: [QueryKeys.NOTES, appliedFilters],
    queryFn: fetchNotes,
  });

  function updateNote(id: number, data: NotePATCH) {
    updateNoteAPI(id, data);

    queryClient.setQueryData(
      [QueryKeys.NOTES, appliedFilters],
      (notes: Note[]) =>
        notes.map((note: Note) => {
          if (note.id === id) {
            return {
              ...note,
              ...data,
            };
          }
          return note;
        })
    );
  }

  async function addNote() {
    const newNote = await createNote({ content: "" });

    queryClient.invalidateQueries({
      queryKey: [QueryKeys.NOTES, appliedFilters],
    });

    return newNote;
  }

  async function removeNote(id: number) {
    await deleteNote(id);

    queryClient.invalidateQueries({
      queryKey: [QueryKeys.NOTES, appliedFilters],
    });
  }

  return (
    <NotesContext.Provider
      value={{
        notes: data,
        isFetching,
        updateNote,
        addNote,
        removeNote,
        appliedFilters,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}
