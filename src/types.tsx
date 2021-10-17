export enum DialogKeys {
  CREATE = "create",
  FILTER = "filter",
  EDIT = "edit",
}

export enum FilterKeys {
  KEYWORD = "q",
  TAGS = "tag",
}

export type Tag = {
  _id: string;
  name: string;
};

export type Entry = {
  _id: string;
  date: Date;
  title: string;
  notes: string | null;
  tags: Tag[];
};

export type EntryFormData = {
  date: Date;
  title: string;
  notes: string;
  tags: string[];
};

export type SortedEntries = {
  [formattedDate: string]: Entry[];
};

export type Journal = {
  _id: string;
  name: string;
};

export type JournalFormData = Pick<Journal, "name">;

export type Response<T> = {
  data: T;
};

export type PaginatedResponse<T> = {
  data: T;
  meta: {
    page: 1;
  };
};
