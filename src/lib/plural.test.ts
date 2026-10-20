import { describe, expect, it } from 'vitest'

import { plural } from './plural'

describe('plural', () => {
  it('uses the singular for one', () => {
    expect(plural(1, 'note')).toBe('1 note')
  })

  it('adds "s" for other counts', () => {
    expect(plural(0, 'note')).toBe('0 notes')
    expect(plural(3, 'note')).toBe('3 notes')
  })

  it('uses the given plural form', () => {
    expect(plural(1, 'note matches', 'notes match')).toBe('1 note matches')
    expect(plural(2, 'note matches', 'notes match')).toBe('2 notes match')
  })
})
