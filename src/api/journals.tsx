import Urls from "constants/urls";
import { reverse } from "named-urls";
import {
  Attachment,
  BlobWithPreview,
  Entry,
  Journal,
  JournalEntryRequestData,
} from "types";
import http from "utils/http";

export async function getJournals(): Promise<Journal[]> {
  return http.get(Urls.api["journals:list"]).then((res) => res.data.data);
}

export async function updateEntry(
  journalId: string,
  entryId: string,
  data: Partial<JournalEntryRequestData>
): Promise<Entry> {
  return http
    .patch(reverse(Urls.api["journal:entry"], { journalId, entryId }), data)
    .then((res) => res.data.data);
}

export async function createEntry(
  journalId: string,
  data: JournalEntryRequestData
): Promise<Entry> {
  return http
    .post(reverse(Urls.api["journal:entries"], { id: journalId }), data)
    .then((res) => res.data.data);
}

export async function uploadImages(
  images: BlobWithPreview[]
): Promise<Attachment[]> {
  const formData = new FormData();

  images.forEach((image) => {
    formData.append("images", image);
  });

  return http
    .post(Urls.api["attachments:upload"], formData)
    .then((res) => res.data.data);
}
