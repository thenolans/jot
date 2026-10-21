import { describe, expect, it } from 'vitest'

import { moveRow } from './rows'

describe('moveRow', () => {
  it('moves a row down and up', () => {
    expect(moveRow(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a'])
    expect(moveRow(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b'])
  })

  it('leaves the rows as they are for a place outside them', () => {
    const rows = ['a', 'b']
    expect(moveRow(rows, 0, 2)).toBe(rows)
    expect(moveRow(rows, -1, 0)).toBe(rows)
    expect(moveRow(rows, 1, 1)).toBe(rows)
  })
})
