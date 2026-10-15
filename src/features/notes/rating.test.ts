import { Marked } from 'marked'
import { describe, expect, it } from 'vitest'

import { ratingExtension, replaceRatings } from './rating'

const render = (markdown: string) =>
  new Marked({ breaks: true, extensions: [ratingExtension] }).parseInline(
    markdown,
    { async: false },
  )

const star = '<span role="img" aria-label="1 star">⭐</span>'
const threeStars = '<span role="img" aria-label="3 stars">⭐⭐⭐</span>'

describe('ratingExtension', () => {
  it('renders one to five stars, labelled with the count', () => {
    expect(render('Frushi /3')).toBe(`Frushi ${threeStars}`)
    expect(render('/1')).toBe(star)
  })

  it('renders a rating at the start of a line or after emphasis and a space', () => {
    expect(render('Frushi\n/3')).toBe(`Frushi<br>${threeStars}`)
    expect(render('**Frushi** /3, then')).toBe(
      `<strong>Frushi</strong> ${threeStars}, then`,
    )
  })

  it('leaves fractions, paths, other numbers and escaped ratings as typed', () => {
    expect(render('1/3 cup')).toBe('1/3 cup')
    expect(render('**Frushi**/3')).toBe('<strong>Frushi</strong>/3')
    expect(render('see example.com/3')).toBe('see example.com/3')
    expect(render('/6 /30 /3rd /3/5')).toBe('/6 /30 /3rd /3/5')
    expect(render('\\/3')).toBe('/3')
  })
})

describe('replaceRatings', () => {
  it('swaps ratings for stars, leaving fractions', () => {
    expect(replaceRatings('Frushi /4\n/2 Ramen, 1/3 cup')).toBe(
      'Frushi ⭐⭐⭐⭐\n⭐⭐ Ramen, 1/3 cup',
    )
  })
})
