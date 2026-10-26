/**
 * Client for our API (`thenolans-api`, Django REST Framework). Requests go to `/api` on the app's
 * own origin, which is proxied to the API.
 *
 * Bodies are sent as JSON, or as multipart form data when given as `FormData` (to send files).
 *
 * The API authenticates with a token sent as `Authorization: Token <key>`. The token is kept in
 * local storage so the session survives reloads.
 *
 * Failed requests throw an `ApiError`, built from DRF's error format:
 * `{ "detail": string }` or `{ "<field>": string[], "non_field_errors": string[] }`.
 */

import { connectivity } from './connectivity'

const BASE_URL = '/api'
const TOKEN_STORAGE_KEY = 'jot.token'

export class ApiError extends Error {
  readonly status: number
  /** Problems with specific input fields, keyed by field name. */
  readonly fieldErrors: Record<string, string>

  constructor(
    status: number,
    message: string,
    fieldErrors: Record<string, string> = {},
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

export const authToken = {
  get() {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY)
    } catch {
      return null
    }
  },
  set(token: string | null) {
    try {
      if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token)
      else localStorage.removeItem(TOKEN_STORAGE_KEY)
    } catch {
      // Storage unavailable (e.g. private mode): the session lasts until reload.
    }
  },
}

const GENERIC_ERROR = 'Something went wrong. Please try again.'

/**
 * How long a request waits for the API to start answering before it counts as unreachable. On a weak
 * signal the device thinks it's online, and a request can hang far longer before the browser gives up.
 * Only the wait for the answer to start is limited, so a slow download of a long answer still finishes.
 */
const RESPONSE_TIMEOUT_MS = 8_000

/**
 * The first message in a DRF error value: a string, a list of them, or, for nested data, an object or
 * list of objects holding them (`[{}, { "email": ["…"] }]`).
 */
function firstMessage(value: unknown): string | undefined {
  if (typeof value === 'string') return value
  const values = Array.isArray(value)
    ? value
    : typeof value === 'object' && value
      ? Object.values(value)
      : []
  for (const item of values) {
    const message = firstMessage(item)
    if (message) return message
  }
  return undefined
}

function toApiError(status: number, body: unknown) {
  if (typeof body !== 'object' || body === null)
    return new ApiError(status, GENERIC_ERROR)

  const {
    detail,
    non_field_errors: nonFieldErrors,
    ...fields
  } = body as Record<string, unknown>
  const fieldErrors = Object.fromEntries(
    Object.entries(fields).map(([field, value]) => [
      field,
      firstMessage(value) ?? GENERIC_ERROR,
    ]),
  )
  return new ApiError(
    status,
    firstMessage(detail ?? nonFieldErrors) ?? GENERIC_ERROR,
    fieldErrors,
  )
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {}
  // The browser sets the multipart content type itself, with the boundary between parts.
  const isFormData = body instanceof FormData
  if (body !== undefined && !isFormData)
    headers['Content-Type'] = 'application/json'
  const token = authToken.get()
  if (token) headers.Authorization = `Token ${token}`

  let response: Response
  const timeout = new AbortController()
  const timer = setTimeout(() => timeout.abort(), RESPONSE_TIMEOUT_MS)
  try {
    response = await fetch(BASE_URL + path, {
      method,
      headers,
      body: body === undefined || isFormData ? body : JSON.stringify(body),
      signal: timeout.signal,
    })
  } catch {
    connectivity.reportUnreachable()
    throw new ApiError(
      0,
      "We couldn't reach Jot. Check your connection and try again.",
    )
  } finally {
    clearTimeout(timer)
  }
  connectivity.reportReachable()

  const data: unknown =
    response.status === 204
      ? undefined
      : await response.json().catch(() => undefined)

  if (!response.ok) throw toApiError(response.status, data)

  return data as T
}

/** Whether a request failed because the API couldn't be reached, rather than being answered with an error. */
export function isNetworkError(error: unknown) {
  return error instanceof ApiError && error.status === 0
}

/** Whether a request was answered with a 404: what it asked for doesn't exist or can't be seen. */
export function isNotFoundError(error: unknown) {
  return error instanceof ApiError && error.status === 404
}

/**
 * `error` with its `fieldErrors` keyed by input field rather than request field, renaming those in
 * `inputNames` (`{ folder_id: 'folderId' }`) so they match the form's input `name`s. Anything that
 * isn't an `ApiError` comes back as it is.
 */
export function rekeyFieldErrors(
  error: unknown,
  inputNames: Record<string, string>,
) {
  if (!(error instanceof ApiError)) return error
  const fieldErrors = Object.fromEntries(
    Object.entries(error.fieldErrors).map(([field, message]) => [
      inputNames[field] ?? field,
      message,
    ]),
  )
  return new ApiError(error.status, error.message, fieldErrors)
}

/** What to tell the user about a failed request. */
export function errorMessage(error: unknown) {
  return error instanceof ApiError ? error.message : GENERIC_ERROR
}

/** One page of a list endpoint's results (DRF's page-number pagination). */
export type Page<T> = {
  /** Results across all pages. */
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

/** `path` with `params` appended as a query string, leaving out empty values. */
export function withQuery(
  path: string,
  params: Record<string, string | number | boolean | null | undefined>,
) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== '')
      query.set(key, String(value))
  }
  const queryString = query.toString()
  return queryString ? `${path}?${queryString}` : path
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  /** Resolves to the response body; `void` by default, since most deletes return none. */
  delete: <T = void>(path: string) => request<T>('DELETE', path),
}
