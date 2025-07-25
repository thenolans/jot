export type Note = {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
};

export type NotePATCH = Partial<Pick<Note, "content" | "is_pinned">>;

export type NotesContext = {
  notes: Note[];
  isFetching: boolean;
  updateNote: (noteId: number, data: NotePATCH) => void;
  removeNote: (noteId: number) => void;
  appliedFilters: string;
  getNoteById: (noteId: number) => Note | undefined;
};

export enum QueryKeys {
  NOTE = "note",
  NOTES = "notes",
}

export enum NotesFilterParams {
  SEARCH = "q",
}
