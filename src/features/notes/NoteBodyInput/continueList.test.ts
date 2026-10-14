import { describe, expect, it } from 'vitest'

import { continueList } from './continueList'

/** `text` with Enter pressed at the `|` in it, or `null` when the list has nothing to do. */
function pressEnter(textWithCursor: string) {
  const cursor = textWithCursor.indexOf('|')
  const text = textWithCursor.replace('|', '')
  const edit = continueList(text, cursor)
  if (!edit) return null
  return text.slice(0, edit.start) + edit.text + text.slice(edit.end)
}

describe('continueList', () => {
  it('starts the next bullet', () => {
    expect(pressEnter('- milk|')).toBe('- milk\n- ')
    expect(pressEnter('* milk|')).toBe('* milk\n* ')
  })

  it('numbers the next item', () => {
    expect(pressEnter('1. milk\n2. eggs|')).toBe('1. milk\n2. eggs\n3. ')
    expect(pressEnter('9) milk|')).toBe('9) milk\n10) ')
  })

  it('keeps the indent of a nested item', () => {
    expect(pressEnter('- milk\n  - oat|')).toBe('- milk\n  - oat\n  - ')
  })

  it('adds an empty box after a task', () => {
    expect(pressEnter('- [x] milk|')).toBe('- [x] milk\n- [ ] ')
  })

  it('splits an item at the cursor', () => {
    expect(pressEnter('- milk| eggs')).toBe('- milk\n-  eggs')
  })

  it('ends the list on an empty item', () => {
    expect(pressEnter('- milk\n- |')).toBe('- milk\n')
    expect(pressEnter('- milk\n- [ ] |')).toBe('- milk\n')
  })

  it('leaves lines that are not list items alone', () => {
    expect(pressEnter('milk|')).toBeNull()
    expect(pressEnter('-milk|')).toBeNull()
  })

  it('leaves a cursor inside the marker alone', () => {
    expect(pressEnter('|- milk')).toBeNull()
  })
})
