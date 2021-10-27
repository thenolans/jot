export enum DialogKeys {
  CREATE = "create",
  FILTER = "filter",
  EDIT = "edit",
}

export enum FilterKeys {
  KEYWORD = "q",
  TAGS = "tag",
}

export enum TagTypes {
  JOURNAL = "journal",
}

export type Tag = {
  _id: string;
  name: string;
  type: TagTypes;
  typeId: string;
};

export type Entry = {
  _id: string;
  date: Date;
  title: string;
  notes: string | null;
  tags: Tag[];
  journalId: string;
};

export type SortedEntries = {
  [formattedDate: string]: Entry[];
};

export type Journal = {
  _id: string;
  name: string;
};

export type PaginatedEntries = {
  data: Entry[];
  meta: {
    journal: Journal;
  };
};

export type JournalFormData = Pick<Journal, "name">;
export type EntryFormData = Omit<Entry, "_id" | "journalId" | "tags"> & {
  tags: string[];
};

export type Response<T> = {
  data: T;
};

export type PaginatedResponse<T> = {
  data: T;
  meta: {
    page: 1;
  };
};

export type ListItem = {
  _id: string;
  title: string;
  isCompleted: boolean;
  groupId: string;
  sortOrder: number;
};

export type ListGroup = {
  _id: string;
  name: string;
  items: ListItem[];
  sortOrder: number;
};

export enum ListType {
  ONE_TIME = "one_time",
  REUSABLE = "reusable",
}

export type List = {
  _id: string;
  name: string;
  type: ListType;
  showCompletedItems: boolean;
  groups: ListGroup[];
};

export type ListFormData = Omit<List, "_id" | "groups">;
export type ListGroupFormData = Pick<ListGroup, "name">;
export type ListItemFormData = Pick<ListItem, "title">;

export enum QueryKeys {
  JOURNAL_LIST = "journal-list",
}

export type Note = {
  _id: string;
  content: string;
};
