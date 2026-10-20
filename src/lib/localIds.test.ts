import { describe, expect, it } from 'vitest'

import { ApiError } from './api'
import {
  apiId,
  isLocalId,
  isSameId,
  newLocalId,
  recordSavedId,
  resolveId,
} from './localIds'

describe('localIds', () => {
  it('makes negative ids, each unlike the last', () => {
    const first = newLocalId()
    const second = newLocalId()
    expect(isLocalId(first)).toBe(true)
    expect(second).toBeLessThan(first)
  })

  it("resolves a local id to its saved id once it's saved", () => {
    const id = newLocalId()
    expect(resolveId(id)).toBe(id)
    expect(() => apiId(id)).toThrow(ApiError)

    recordSavedId(id, 42)
    expect(resolveId(id)).toBe(42)
    expect(apiId(id)).toBe(42)
    expect(isSameId(id, 42)).toBe(true)
    expect(apiId(7)).toBe(7)
  })
})
