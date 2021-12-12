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
  images?: string[];
  journalId: string;
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

export type SortedEntries = {
  dates: string[];
  entriesByDate: {
    [date: string]: Entry[];
  };
  count: number;
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
  listId: string;
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
  itemCount: number;
};

export type ListFormData = Omit<List, "_id" | "groups" | "itemCount">;
export type ListGroupFormData = Pick<ListGroup, "name">;
export type ListItemFormData = Pick<ListItem, "title">;

export enum QueryKeys {
  JOURNAL_LIST = "journal-list",
  NOTES_LIST = "notes-list",
  LISTS_LIST = "lists-list",
}

export type Note = {
  _id: string;
  content: string;
  isPrivate: boolean;
};

export enum FormIds {
  ADD_LIST = "add-list-form",
  ADD_LIST_GROUP = "add-list-group-form",
  ADD_LIST_ITEM = "add-list-item-form",
  EDIT_LIST = "edit-list-form",
  EDIT_LIST_GROUP = "edit-list-group-form",
  EDIT_LIST_ITEM = "edit-list-item-form",
}
