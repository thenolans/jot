export type Entry = {
  _id: string;
  title: string;
  notes: string | null;
  tags: string[];
  createdAt: string;
};

export type SortedEntries = {
  [formattedDate: string]: Entry[];
};
