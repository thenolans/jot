import { describe, expect, it } from 'vitest'

import { cx } from './cx'

describe('cx', () => {
  it('keeps a background color beside the topo texture', () => {
    expect(cx('bg-accent bg-topo-brand')).toBe('bg-accent bg-topo-brand')
  })

  it.each([
    ['bg-none', 'bg-topo-brand'],
    ['duration-200', 'duration-slide'],
    ['ease-in', 'ease-out-quint'],
    ['animate-pulse', 'animate-fade-in'],
    ['animate-none', 'animate-rise-in'],
    ['pb-4', 'pb-safe-area'],
    ['font-sans', 'font-display'],
    ['shadow-sm', 'shadow-card'],
  ])('lets %s and %s override each other', (a, b) => {
    expect(cx(a, b)).toBe(b)
    expect(cx(b, a)).toBe(a)
  })

  it('keeps a custom name beside utilities it does not conflict with', () => {
    expect(cx('duration-slide ease-out-quint')).toBe(
      'duration-slide ease-out-quint',
    )
  })
})
