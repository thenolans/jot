import { describe, expect, it } from 'vitest'

import {
  checklistContent,
  checklistItems,
  fromChecklist,
  toChecklist,
  withoutEmptyItems,
} from './checklist'

describe('checklistItems', () => {
  it('reads tasks, checked off or not', () => {
    expect(checklistItems('- [ ] Eggs\n- [x] Lemons\n- [X] Oats')).toEqual([
      { text: 'Eggs', done: false },
      { text: 'Lemons', done: true },
      { text: 'Oats', done: true },
    ])
  })

  it('keeps an empty item', () => {
    expect(checklistItems('- [ ] Eggs\n- [ ] ')).toEqual([
      { text: 'Eggs', done: false },
      { text: '', done: false },
    ])
    expect(checklistItems('- [ ]')).toEqual([{ text: '', done: false }])
  })

  it("reads an item's text as it is", () => {
    expect(
      checklistItems('- [ ] **Ripe** [avocados](https://x.co) /4'),
    ).toEqual([{ text: '**Ripe** [avocados](https://x.co) /4', done: false }])
  })
})

describe('toChecklist', () => {
  it('turns lists into tasks', () => {
    expect(toChecklist('- Eggs\n* Oats\n+ Rice\n1. Milk\n2) Tea')).toBe(
      '- [ ] Eggs\n- [ ] Oats\n- [ ] Rice\n- [ ] Milk\n- [ ] Tea',
    )
  })

  it('flattens nested lists', () => {
    expect(toChecklist('- Fruit\n  - Lemons')).toBe('- [ ] Fruit\n- [ ] Lemons')
  })

  it('keeps tasks as they are', () => {
    expect(toChecklist('- [x] Eggs\n- [ ] Oats')).toBe('- [x] Eggs\n- [ ] Oats')
  })

  it('makes an item of every other line with text', () => {
    expect(
      toChecklist('# Groceries\n\nFor Sunday\n> Ask Sam\n\n---\n- Eggs'),
    ).toBe('- [ ] Groceries\n- [ ] For Sunday\n- [ ] Ask Sam\n- [ ] Eggs')
  })

  it('leaves out lines with nothing to keep', () => {
    expect(
      toChecklist('```\ncode\n```\n| a | b |\n| --- | :-: |\n***\n___'),
    ).toBe('- [ ] code\n- [ ] | a | b |')
  })

  it("doesn't take a word that starts like a number for a list", () => {
    expect(toChecklist('2024 taxes')).toBe('- [ ] 2024 taxes')
  })

  it('makes items plain text', () => {
    expect(
      toChecklist('- **Ripe** [avocados](https://x.co) `x2` ![pic](a.png)'),
    ).toBe('- [ ] Ripe avocados x2 pic')
  })

  it('leaves an empty note empty', () => {
    expect(toChecklist('')).toBe('')
  })
})

describe('fromChecklist', () => {
  it('turns tasks into bullets, dropping checks and empty items', () => {
    expect(fromChecklist('- [ ] Eggs\n- [x] Lemons\n- [ ] ')).toBe(
      '- Eggs\n- Lemons',
    )
  })
})

describe('withoutEmptyItems', () => {
  it('drops empty items', () => {
    expect(withoutEmptyItems('- [ ] \n- [x] Eggs\n- [ ]   \n- [ ] Oats')).toBe(
      '- [x] Eggs\n- [ ] Oats',
    )
  })
})

describe('checklistContent', () => {
  it('writes a task per item', () => {
    expect(
      checklistContent([
        { text: 'Eggs', done: false },
        { text: 'Lemons', done: true },
      ]),
    ).toBe('- [ ] Eggs\n- [x] Lemons')
  })
})
