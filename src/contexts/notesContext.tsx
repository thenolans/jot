import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteNote, fetchNotes, updateNote as updateNoteAPI } from "api/notes";
import { createContext, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import {
  Note,
  NotePATCH,
  NotesContext as NotesContextType,
  NotesFilterParams,
  QueryKeys,
} from "types";
import cleanFilterParams from "utils/cleanFilterParams";

type Props = {
  children: ReactNode;
};

const PLACEHOLDER_NOTE = {
  id: 0,
  content: "",
  created_at: "",
  updated_at: "",
  is_pinned: false,
  folder_id: null,
};

export const NotesContext = createContext<NotesContextType>({
  notes: [],
  isFetching: false,
  updateNote() {},
  removeNote() {},
  appliedFilters: "",
  getNoteById() {
    return PLACEHOLDER_NOTE;
  },
});

export default function NotesContextProvider({ children }: Props) {
  const queryClient = useQueryClient();
  const location = useLocation();
  // Clean filters to exclude non-filter params like editing_note_id
  // This prevents query key changes when modal opens/closes
  const appliedFilters = cleanFilterParams(
    location.search,
    Object.values(NotesFilterParams),
  );

  const { data = [], isFetching } = useQuery<Note[]>({
    queryKey: [QueryKeys.NOTES, appliedFilters],
    queryFn: fetchNotes,
  });

  function getNoteById(noteId: number) {
    return data.find((note) => note.id === noteId);
  }

  function updateNote(id: number, data: NotePATCH) {
    updateNoteAPI(id, data);

    queryClient.setQueryData(
      [QueryKeys.NOTES, appliedFilters],
      (notes: Note[]) =>
        notes.map((note: Note) => {
          if (note.id === id) {
            return {
              ...note,
              updated_at: new Date().toISOString(),
              ...data,
            };
          }
          return note;
        }),
    );
  }

  async function removeNote(id: number) {
    queryClient.setQueryData(
      [QueryKeys.NOTES, appliedFilters],
      (notes: Note[] | undefined) =>
        notes?.filter((note: Note) => note.id !== id) || [],
    );

    try {
      await deleteNote(id);
    } catch (error) {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.NOTES, appliedFilters],
      });
      throw error;
    }
  }

  return (
    <NotesContext.Provider
      value={{
        notes: data,
        isFetching,
        updateNote,
        removeNote,
        appliedFilters,
        getNoteById,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}
