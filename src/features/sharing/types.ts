/** What someone a note is shared with can do with it: read it, or change its title and text too. Only the owner can move, delete or share it. */
export type SharePermission = 'view' | 'edit'

/** A note shared with whoever signs in with `email`. */
export type Share = {
  id: number
  noteId: number
  email: string
  /** The name of the account that uses the email, or `''` when none does yet. */
  name: string
  permission: SharePermission
  createdAt: string
}

export type ShareInput = {
  noteId: number
  email: string
  permission: SharePermission
}
