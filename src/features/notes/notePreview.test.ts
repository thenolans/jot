import { describe, expect, it } from 'vitest'

import { notePreview, previewLines } from './notePreview'

describe('notePreview', () => {
  it('takes out emphasis and code', () => {
    expect(
      notePreview('*Stupid* shirt, **bold** move, _odd_ snake_case `4471`'),
    ).toBe('Stupid shirt, bold move, odd snake_case 4471')
  })

  it('takes out heading and quote markers, keeping the text', () => {
    expect(notePreview('## Tried so far\n> quoted')).toBe(
      'Tried so far\nquoted',
    )
  })

  it('keeps list markers and line breaks', () => {
    expect(notePreview('1. Gianduja\n2. Caramel\n- Lanyard')).toBe(
      '1. Gianduja\n2. Caramel\n- Lanyard',
    )
  })

  it('takes out task boxes', () => {
    expect(notePreview('- [ ] Lanyard\n- [x] Zip ties')).toBe(
      '- Lanyard\n- Zip ties',
    )
  })

  it('keeps the text of links and images', () => {
    expect(
      notePreview('See [the map](https://example.com) ![booth](a.png)'),
    ).toBe('See the map booth')
  })

  it('collapses runs of blank lines and trims', () => {
    expect(notePreview('\n\nOne\n\n\n\nTwo\n')).toBe('One\n\nTwo')
  })

  it('cuts long notes short', () => {
    expect(notePreview('a'.repeat(2000))).toHaveLength(600)
  })
})

describe('previewLines', () => {
  it('shows more lines for longer previews', () => {
    expect(previewLines('11:30am, Terminal 8')).toBe(3)
    expect(previewLines('a'.repeat(100))).toBe(5)
    expect(previewLines('a'.repeat(300))).toBe(7)
    expect(previewLines('a'.repeat(600))).toBe(9)
  })
})
