export enum DialogKeys {
  CREATE = "create",
  FILTER = "filter",
}

export type Entry = {
  _id: string;
  date: Date;
  title: string;
  notes: string | null;
  tags: string[];
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
