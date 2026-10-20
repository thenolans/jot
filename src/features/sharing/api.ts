import { api, withQuery } from '@/lib/api'

import type { Share, ShareInput, SharePermission } from './types'

/** A share as the API sends it. */
type ShareResponse = {
  id: number
  note_id: number
  email: string
  name: string
  permission: SharePermission
  created_at: string
}

function toShare(response: ShareResponse): Share {
  return {
    id: response.id,
    noteId: response.note_id,
    email: response.email,
    name: response.name,
    permission: response.permission,
    createdAt: response.created_at,
  }
}

const sharesPath = '/jot/note-shares/'

/** Who one of the user's notes is shared with, oldest first. */
export async function fetchShares(noteId: number): Promise<Share[]> {
  return (
    await api.get<ShareResponse[]>(withQuery(sharesPath, { note_id: noteId }))
  ).map(toShare)
}

/**
 * Shares one of the user's notes with an email, which needn't have an account yet. Fails with an
 * `ApiError` whose `fieldErrors.email` says why, e.g. when it's already shared with them.
 */
export async function createShare({
  noteId,
  email,
  permission,
}: ShareInput): Promise<Share> {
  return toShare(
    await api.post<ShareResponse>(sharesPath, {
      note_id: noteId,
      email,
      permission,
    }),
  )
}

/** Changes what someone a note is shared with can do with it, returning the share as saved. */
export async function updateShare(
  id: number,
  permission: SharePermission,
): Promise<Share> {
  return toShare(
    await api.patch<ShareResponse>(`${sharesPath}${id}/`, { permission }),
  )
}

/** Stops sharing a note with someone. */
export function deleteShare(id: number) {
  return api.delete(`${sharesPath}${id}/`)
}
