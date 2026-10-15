import { api, rekeyFieldErrors } from '@/lib/api'

import type { Folder, FolderChanges, NewFolder } from './types'

/** A folder as the API sends it. */
type FolderResponse = {
  id: number
  name: string
  parent_folder_id: number | null
  is_private: boolean
  note_count: number
}

function toFolder(response: FolderResponse): Folder {
  return {
    id: response.id,
    name: response.name,
    parentId: response.parent_folder_id,
    isPrivate: response.is_private,
    noteCount: response.note_count,
  }
}

const inputNames = { parent_folder_id: 'parentId' }

/** Every one of the signed-in user's folders, at every level, sorted by name. */
export async function fetchFolders(): Promise<Folder[]> {
  return (await api.get<FolderResponse[]>('/jot/folders/')).map(toFolder)
}

/** Makes a folder for the signed-in user, returning it as saved. */
export async function createFolder({
  name,
  parentId,
}: NewFolder): Promise<Folder> {
  try {
    return toFolder(
      await api.post<FolderResponse>('/jot/folders/', {
        name,
        parent_folder_id: parentId,
      }),
    )
  } catch (error) {
    throw rekeyFieldErrors(error, inputNames)
  }
}

/** Renames or moves a folder, or makes it private or not, returning it as saved. */
export async function updateFolder(
  id: number,
  { name, parentId, isPrivate }: FolderChanges,
): Promise<Folder> {
  try {
    return toFolder(
      await api.patch<FolderResponse>(`/jot/folders/${id}/`, {
        name,
        parent_folder_id: parentId,
        is_private: isPrivate,
      }),
    )
  } catch (error) {
    throw rekeyFieldErrors(error, inputNames)
  }
}

/** Deletes a folder, with the folders and notes inside it. */
export async function deleteFolder(id: number): Promise<void> {
  await api.delete(`/jot/folders/${id}/`)
}
