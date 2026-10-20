import { describe, expect, it } from 'vitest'

import { viewFilters } from './viewFilters'

describe('viewFilters', () => {
  it('leaves shared notes out of All', () => {
    expect(viewFilters({}).shared).toBe(false)
  })

  it('takes shared notes into a search of All', () => {
    expect(viewFilters({ query: 'soup' }).shared).toBeNull()
  })

  it('shows only shared notes in the shared view', () => {
    expect(viewFilters({ shared: true }).shared).toBe(true)
  })

  it("doesn't narrow a folder or the unfiled notes by sharing", () => {
    expect(viewFilters({ folderId: 3 }).shared).toBeNull()
    expect(viewFilters({ unfiled: true }).shared).toBeNull()
  })
})
