import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  api,
  ApiError,
  errorMessage,
  isNotFoundError,
  rekeyFieldErrors,
} from './api'

const GENERIC_ERROR = 'Something went wrong. Please try again.'

/** Makes the next `fetch` respond with `body` as JSON, or as-is when it's a string. */
function respond(status: number, body?: unknown) {
  const text =
    body === undefined
      ? null
      : typeof body === 'string'
        ? body
        : JSON.stringify(body)
  const fetch = vi.fn(async () => new Response(text, { status }))
  vi.stubGlobal('fetch', fetch)
  return fetch
}

/** The `ApiError` a request fails with. */
async function failure(request: Promise<unknown>) {
  const error = await request.catch((caught: unknown) => caught)
  expect(error).toBeInstanceOf(ApiError)
  return error as ApiError
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('api', () => {
  it('sends JSON to /api and returns the response', async () => {
    const fetch = respond(200, { token: 'abc' })
    await expect(api.post('/user/login/', { email: 'a@b.c' })).resolves.toEqual(
      { token: 'abc' },
    )
    expect(fetch).toHaveBeenCalledWith('/api/user/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"email":"a@b.c"}',
      signal: expect.any(AbortSignal),
    })
  })

  it('sends FormData as-is, leaving the content type to the browser', async () => {
    const fetch = respond(200, {})
    const body = new FormData()
    body.set('body', 'Hello')
    await api.post('/jot/notes/', body)
    expect(fetch).toHaveBeenCalledWith('/api/jot/notes/', {
      method: 'POST',
      headers: {},
      body,
      signal: expect.any(AbortSignal),
    })
  })

  it("counts the API as unreachable when it doesn't start answering in time", async () => {
    vi.useFakeTimers()
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_: string, { signal }: RequestInit) =>
          new Promise((_, reject) =>
            signal?.addEventListener('abort', () => reject(signal.reason)),
          ),
      ),
    )
    const request = failure(api.get('/jot/notes/'))
    await vi.advanceTimersByTimeAsync(8_000)
    expect((await request).status).toBe(0)
    vi.useRealTimers()
  })

  it('returns nothing for 204 No Content', async () => {
    respond(204)
    await expect(api.post('/user/logout/')).resolves.toBeUndefined()
  })
})

describe('API errors', () => {
  it('uses `detail` as the message', async () => {
    respond(404, { detail: 'Not found.' })
    const error = await failure(api.get('/jot/notes/1/'))
    expect(error).toMatchObject({
      status: 404,
      message: 'Not found.',
      fieldErrors: {},
    })
  })

  it('uses the first of `non_field_errors` as the message', async () => {
    respond(400, {
      non_field_errors: [
        'Unable to log in with provided credentials.',
        'Another.',
      ],
    })
    const error = await failure(api.post('/user/login/', {}))
    expect(error).toMatchObject({
      status: 400,
      message: 'Unable to log in with provided credentials.',
      fieldErrors: {},
    })
  })

  it('keeps the first message for each field', async () => {
    respond(400, {
      email: ['Enter a valid email address.'],
      password: ['Too short.', 'Too common.'],
    })
    const error = await failure(api.post('/user/register/', {}))
    expect(error.message).toBe(GENERIC_ERROR)
    expect(error.fieldErrors).toEqual({
      email: 'Enter a valid email address.',
      password: 'Too short.',
    })
  })

  it('finds the first message in nested list errors', async () => {
    respond(400, {
      shares: [{}, { email: ['Enter a valid email address.'] }],
      folders: [{}, {}],
    })
    const error = await failure(api.post('/jot/notes/', {}))
    expect(error.fieldErrors).toEqual({
      shares: 'Enter a valid email address.',
      folders: GENERIC_ERROR,
    })
  })

  it('falls back to a generic message for a body that is not JSON', async () => {
    respond(500, '<h1>Server Error</h1>')
    const error = await failure(api.get('/jot/notes/'))
    expect(error).toMatchObject({
      status: 500,
      message: GENERIC_ERROR,
      fieldErrors: {},
    })
  })

  it('reports a request that never reached the API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
    )
    const error = await failure(api.get('/jot/notes/'))
    expect(error.status).toBe(0)
    expect(error.message).toMatch(/couldn't reach Jot/)
  })
})

describe('rekeyFieldErrors', () => {
  it('renames the given fields and keeps the rest', () => {
    const error = rekeyFieldErrors(
      new ApiError(400, 'Bad.', { folder_id: 'Not found.', name: 'Taken.' }),
      { folder_id: 'folderId' },
    )
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({
      status: 400,
      message: 'Bad.',
      fieldErrors: { folderId: 'Not found.', name: 'Taken.' },
    })
  })

  it('returns anything other than an ApiError as it is', () => {
    const error = new Error('boom')
    expect(rekeyFieldErrors(error, { folder_id: 'folderId' })).toBe(error)
  })
})

describe('errorMessage', () => {
  it("is an ApiError's message, or a generic one for anything else", () => {
    expect(errorMessage(new ApiError(400, 'Bad.'))).toBe('Bad.')
    expect(errorMessage(new Error('boom'))).toBe(GENERIC_ERROR)
  })
})

describe('isNotFoundError', () => {
  it('is true only for an ApiError with a 404', () => {
    expect(isNotFoundError(new ApiError(404, 'Not found.'))).toBe(true)
    expect(isNotFoundError(new ApiError(403, 'Forbidden.'))).toBe(false)
    expect(isNotFoundError(new Error('Not found.'))).toBe(false)
  })
})
