import Urls from "constants/urls";
import { reverse } from "named-urls";
import { Entry, EntryFormData, Journal } from "types";
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

export async function createEntry(
  journalId: string,
  data: EntryFormData
): Promise<Entry> {
  const { images, ...remainingData } = data;
  console.log(data);
  const formData = new FormData();

  if (images && images.length) {
    images.forEach((image) => {
      formData.append("images", image);
    });
  }

  Object.keys(remainingData).forEach((key) => {
    // @ts-expect-error
    const keyData = remainingData[key];

    if (Array.isArray(keyData) && !keyData.length) return;

    console.log(key, keyData);

    formData.append(key, keyData);
  });

  return http
    .post(reverse(Urls.api["journal:entries"], { id: journalId }), formData)
    .then((res) => res.data.data);
}
