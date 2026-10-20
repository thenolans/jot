import { displayName } from '@/features/auth/displayName'

import type { Note } from './types'

/** Whether the user can change the note's title and text: it's theirs, or it was shared with them to edit. */
export const canEditNote = ({ access }: Pick<Note, 'access'>) =>
  access !== 'view'

/** Whether the user has shared their note with anyone. */
export const isSharedByUser = ({ shareCount }: Pick<Note, 'shareCount'>) =>
  shareCount > 0

/** Whether the note is someone else's, shared with the user. */
export const isSharedWithUser = ({ access }: Pick<Note, 'access'>) =>
  access !== 'owner'

/** Who shared a note with the user, for its label: "Shared by Ann Lee". */
export const sharedByLabel = ({ owner }: Pick<Note, 'owner'>) =>
  `Shared by ${displayName(owner)}`
