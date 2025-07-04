import { QueryFunctionContext } from "@tanstack/react-query";
import { get } from "@thenolans/nolan-ui";
import { API_URLS } from "constants/urls";
import { Note, NotesFilterParams } from "types";
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
