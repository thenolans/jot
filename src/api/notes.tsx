import { QueryFunctionContext } from "@tanstack/react-query";
import { get } from "@thenolans/nolan-ui";
import { API_URLS } from "constants/urls";
import { Note } from "types";

export async function fetchNotes({
  queryKey,
}: QueryFunctionContext): Promise<Note[]> {
  return await get({
    path: API_URLS["note:list"],
  });
}
