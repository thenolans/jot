import { api, ApiError } from '@/lib/api'
import { authToken } from '@/lib/authToken'

import type { LoginInput, RegisterInput, User } from './types'

/** Exchanges credentials for a token, then loads the user it belongs to. */
export async function login(input: LoginInput) {
  const { token } = await api
    .post<{ token: string }>('/user/login/', input)
    .catch((error: unknown) => {
      // The API words a credential mismatch for developers; say it plainly.
      if (
        error instanceof ApiError &&
        error.status === 400 &&
        Object.keys(error.fieldErrors).length === 0
      ) {
        throw new ApiError(
          error.status,
          "That email and password don't match an account.",
        )
      }
      throw error
    })

  authToken.set(token)
  const user = await fetchCurrentUser()
  if (!user)
    throw new ApiError(401, "We couldn't sign you in. Please try again.")
  return user
}

/**
 * Creates an account, then signs in to it (registering doesn't return a token). Naming the app
 * has the API send Jot's welcome email.
 */
export async function register(input: RegisterInput) {
  await api.post<User>('/user/register/', { ...input, app: 'jot' })
  return login({ email: input.email, password: input.password })
}

/** Revokes the token on the API, then forgets it. It's forgotten even if revoking fails. */
export async function logout() {
  try {
    if (authToken.get()) await api.post<void>('/user/logout/')
  } finally {
    authToken.set(null)
  }
}

/** The signed-in user, or `null` when there's no valid token. */
export async function fetchCurrentUser() {
  if (!authToken.get()) return null

  try {
    return await api.get<User>('/user/me/')
  } catch (error) {
    // The request has already dropped the rejected token.
    if (error instanceof ApiError && error.status === 401) return null
    throw error
  }
}
