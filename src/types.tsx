export type Note = {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
};

export type NotePATCH = Pick<Note, "content">;

export type NotesContext = {
  notes: Note[];
  isFetching: boolean;
  updateNote: (noteId: number, data: NotePATCH) => void;
  addNote: () => Promise<Note>;
};

export enum QueryKeys {
  NOTES = "notes",
}

export enum NotesFilterParams {
  SEARCH = "q",
}
