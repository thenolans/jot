import { describe, expect, it } from 'vitest'

import { GAP, pageItems } from './pageItems'

describe('pageItems', () => {
  it('lists every page when they all fit', () => {
    expect(pageItems(1, 1)).toEqual([1])
    expect(pageItems(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('leaves a gap before the last page near the start', () => {
    expect(pageItems(1, 10)).toEqual([1, 2, 3, 4, 5, GAP, 10])
    expect(pageItems(4, 10)).toEqual([1, 2, 3, 4, 5, GAP, 10])
  })

  it('leaves a gap after the first page near the end', () => {
    expect(pageItems(7, 10)).toEqual([1, GAP, 6, 7, 8, 9, 10])
    expect(pageItems(10, 10)).toEqual([1, GAP, 6, 7, 8, 9, 10])
  })

  it('leaves gaps on both sides in the middle', () => {
    expect(pageItems(5, 10)).toEqual([1, GAP, 4, 5, 6, GAP, 10])
    expect(pageItems(6, 10)).toEqual([1, GAP, 5, 6, 7, GAP, 10])
  })

  it('keeps one length past the pages that fit', () => {
    for (let page = 1; page <= 20; page++)
      expect(pageItems(page, 20)).toHaveLength(7)
  })

  it('widens the window with more siblings', () => {
    expect(pageItems(10, 20, 2)).toEqual([1, GAP, 8, 9, 10, 11, 12, GAP, 20])
  })
})
