import Urls from "constants/urls";
import { reverse } from "named-urls";
import { stringifyUrl } from "query-string";
import { Note } from "types";
import http from "utils/http";

export async function getNotes(q?: string) {
  return http
    .get(stringifyUrl({ url: Urls.api["notes:notes"], query: { q } }))
    .then((res) => res.data.data);
}

export async function createNote() {
  return http.post(Urls.api["notes:notes"]).then((res) => res.data.data);
}

export async function updateNote(noteId: string, data: Partial<Note>) {
  return http
    .patch(reverse(Urls.api["notes:note"], { id: noteId }), data)
    .then((res) => res.data.data);
}

export async function deleteNote(noteId: string) {
  return http.delete(
    reverse(Urls.api["notes:note"], {
      id: noteId,
    })
  );
}
