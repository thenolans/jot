export type User = {
  id: number
  name: string
  email: string
}

/** Anyone the app shows, such as the signed-in user. `email` is `null` where it's kept private. */
export type Person = {
  name: string
  email: string | null
}

export type LoginInput = {
  email: string
  password: string
}

export type RegisterInput = {
  name: string
  email: string
  password: string
}

/** Router state `RequireAuth` leaves behind, so signing in can return to the page that was asked for. */
export type RedirectState = {
  from?: { pathname: string; search: string; hash: string }
}
