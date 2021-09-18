export enum DialogKeys {
  CREATE = "create",
  FILTER = "filter",
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

export type SortedEntries = {
  [formattedDate: string]: Entry[];
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
