export type Note = {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
};

export enum QueryKeys {
  NOTES = "notes",
}

export enum NotesFilterParams {
  SEARCH = "q",
}
