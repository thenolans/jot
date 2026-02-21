import { QueryFunctionContext } from "@tanstack/react-query";
import { get } from "@thenolans/nolan-ui";
import { API_URLS } from "constants/urls";
import { Folder } from "types";

export async function fetchFolders({
  queryKey,
}: QueryFunctionContext): Promise<Folder[]> {
  let path = API_URLS["folder:list"];
  const folder_id = queryKey[1] as string | null;

  if (folder_id) {
    path += `?parent_folder_id=${folder_id}`;
  }

  return await get({
    path,
  });
}
