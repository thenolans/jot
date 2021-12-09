import Urls from "constants/urls";
import { reverse } from "named-urls";
import { Entry, Journal } from "types";
import http from "utils/http";

export async function getJournals(): Promise<Journal[]> {
  return http.get(Urls.api["journals:list"]).then((res) => res.data.data);
}

export async function updateEntry(
  journalId: string,
  entryId: string,
  data: Partial<Entry>
): Promise<Entry> {
  return http
    .patch(reverse(Urls.api["journal:entry"], { journalId, entryId }), data)
    .then((res) => res.data.data);
}
