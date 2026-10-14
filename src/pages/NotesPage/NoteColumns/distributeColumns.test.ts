import { describe, expect, it } from 'vitest'

import { distributeColumns } from './distributeColumns'

const height = (item: number) => item

describe('distributeColumns', () => {
  it('keeps everything in one column', () => {
    expect(distributeColumns([3, 1, 2], 1, height)).toEqual([[3, 1, 2]])
  })

  it('deals the first row left to right', () => {
    expect(distributeColumns([1, 1, 1], 3, height)).toEqual([[1], [1], [1]])
  })

  it('adds each item to the shortest column', () => {
    expect(distributeColumns([5, 1, 1, 1, 1], 2, height)).toEqual([
      [5],
      [1, 1, 1, 1],
    ])
  })

  it('leaves columns empty when there are fewer items', () => {
    expect(distributeColumns([1], 3, height)).toEqual([[1], [], []])
  })
})
