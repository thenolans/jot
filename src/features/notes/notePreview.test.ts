import { describe, expect, it } from 'vitest'

import { maxPreviewLines, notePreview, previewLines } from './notePreview'

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

  it('turns ratings into stars', () => {
    expect(notePreview('Frushi /3\n1/3 cup')).toBe('Frushi ⭐⭐⭐\n1/3 cup')
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
    expect(notePreview('a'.repeat(2000))).toHaveLength(1000)
  })
})

describe('previewLines', () => {
  it('counts lines as they wrap', () => {
    expect(previewLines('11:30am, Terminal 8', 1)).toBe(1)
    expect(previewLines('a'.repeat(100), 1)).toBe(3)
    expect(previewLines('One\nTwo\n\nThree', 1)).toBe(4)
  })

  it('stops at a maximum that varies by note', () => {
    const long = 'a'.repeat(1000)
    expect(new Set([1, 2, 3, 4].map((id) => previewLines(long, id))).size).toBe(
      4,
    )
    expect(previewLines(long, -3)).toBe(maxPreviewLines(-3))
  })
})
