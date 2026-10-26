import { describe, expect, it } from 'vitest'

import { mergeNote, mergeText } from './noteText'

const base = '- [ ] Eggs\n- [ ] Lemons\n- [ ] Flour\n- [ ] Butter'

describe('mergeText', () => {
  it('takes the side that changed', () => {
    expect(mergeText(base, base, 'Theirs')).toBe('Theirs')
    expect(mergeText(base, 'Mine', base)).toBe('Mine')
    expect(mergeText(base, 'Same', 'Same')).toBe('Same')
  })

  it('keeps changes to different lines', () => {
    expect(
      mergeText(
        base,
        '- [x] Eggs\n- [ ] Lemons\n- [ ] Flour\n- [ ] Butter',
        '- [ ] Eggs\n- [ ] Lemons\n- [ ] Flour\n- [ ] Butter\n- [ ] Milk',
      ),
    ).toBe('- [x] Eggs\n- [ ] Lemons\n- [ ] Flour\n- [ ] Butter\n- [ ] Milk')
  })

  it('keeps changes to neighbouring lines', () => {
    expect(
      mergeText(
        base,
        '- [x] Eggs\n- [ ] Lemons\n- [ ] Flour\n- [ ] Butter',
        '- [ ] Eggs\n- [x] Lemons\n- [ ] Flour\n- [ ] Butter',
      ),
    ).toBe('- [x] Eggs\n- [x] Lemons\n- [ ] Flour\n- [ ] Butter')
  })

  it('keeps changes to different words of a line', () => {
    expect(
      mergeText(
        'Pool gate: 0092',
        'Pool gate: 0092, side door: 4471',
        'Pool gate code: 0092',
      ),
    ).toBe('Pool gate code: 0092, side door: 4471')
  })

  it("can't keep changes to the same words", () => {
    expect(
      mergeText('Pool gate: 0092', 'Pool gate: 0093', 'Pool gate: 0094'),
    ).toBeNull()
  })

  it("can't keep a line changed on one side and removed on the other", () => {
    expect(
      mergeText(
        base,
        '- [ ] Eggs\n- [ ] Flour\n- [ ] Butter',
        '- [ ] Eggs\n- [x] Lemons\n- [ ] Flour\n- [ ] Butter',
      ),
    ).toBeNull()
  })

  it("doesn't count text trimmed by the API as a change", () => {
    expect(mergeText('Pool gate ', 'Pool gate code', 'Pool gate')).toBe(
      'Pool gate code',
    )
  })
})

describe('mergeNote', () => {
  const note = { title: 'Groceries', content: base, isChecklist: true }

  it('merges each field', () => {
    expect(
      mergeNote(
        note,
        { ...note, title: 'Groceries for Sunday' },
        { ...note, content: `${base}\n- [ ] Milk`, isChecklist: false },
      ),
    ).toEqual({
      title: 'Groceries for Sunday',
      content: `${base}\n- [ ] Milk`,
      isChecklist: false,
    })
  })

  it("can't merge when a field can't be", () => {
    expect(
      mergeNote(
        note,
        { ...note, title: 'Sunday' },
        { ...note, title: 'Monday' },
      ),
    ).toBeNull()
  })
})
