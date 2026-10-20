import { describe, expect, it } from 'vitest'

import { notesViewParams } from './paths'

describe('notesViewParams', () => {
  const current = new URLSearchParams('q=soup&folder=3&page=2')

  it('switches the view, keeping the search and dropping the page', () => {
    expect(notesViewParams(current, { shared: true }).toString()).toBe(
      'q=soup&shared=1',
    )
    expect(notesViewParams(current, { folder: 5 }).toString()).toBe(
      'q=soup&folder=5',
    )
  })

  it('shows every note with no view', () => {
    expect(notesViewParams(current).toString()).toBe('q=soup')
  })

  it('leaves the params it was given alone', () => {
    notesViewParams(current, { unfiled: true })
    expect(current.toString()).toBe('q=soup&folder=3&page=2')
  })
})
