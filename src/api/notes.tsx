import { QueryFunctionContext } from "@tanstack/react-query";
import { destroy, get, patch, post } from "@thenolans/nolan-ui";
import { API_URLS } from "constants/urls";
import { reverse } from "named-urls";
import { Note, NotePATCH, NotesFilterParams } from "types";
import cleanFilterParams from "utils/cleanFilterParams";

export async function fetchNotes({
  queryKey,
}: QueryFunctionContext): Promise<Note[]> {
  let path = API_URLS["note:list"];
  const filters = queryKey[1] as string;
  const cleanedFilters = cleanFilterParams(
    filters,
    Object.values(NotesFilterParams)
  );

  if (cleanedFilters) {
    path += `?${cleanedFilters}`;
  }

  return await get({
    path,
  });
}

export async function deleteNote(noteId: number): Promise<void> {
  const path = reverse(API_URLS["note:detail"], { id: noteId });
  return await destroy({ path });
}

export async function updateNote(
  noteId: number,
  data: NotePATCH
): Promise<Note> {
  const path = reverse(API_URLS["note:detail"], { id: noteId });
  return await patch({ path, data });
}

export async function createNote(data: NotePATCH): Promise<Note> {
  return await post({ path: API_URLS["note:list"], data });
}

export async function getNote({
  queryKey,
}: QueryFunctionContext): Promise<Note> {
  const noteId = queryKey[1] as number;
  const path = reverse(API_URLS["note:detail"], {
    id: noteId,
  });
  return await get({ path });
}
