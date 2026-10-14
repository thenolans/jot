import { describe, expect, it } from 'vitest'

import { plural } from './plural'

describe('plural', () => {
  it('uses the singular for one', () => {
    expect(plural(1, 'serving')).toBe('1 serving')
  })

  it('adds "s" for other counts', () => {
    expect(plural(0, 'serving')).toBe('0 servings')
    expect(plural(3, 'serving')).toBe('3 servings')
  })

  it('uses the given plural form', () => {
    expect(plural(1, 'recipe matches', 'recipes match')).toBe(
      '1 recipe matches',
    )
    expect(plural(2, 'recipe matches', 'recipes match')).toBe('2 recipes match')
  })
})
