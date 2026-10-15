import type { TokenizerAndRendererExtension } from 'marked'

/**
 * A rating, `/1` to `/5`: at the start of a line or after a space (not `1/3` or `example.com/3`), and with
 * nothing straight after the digit (not `/30`, `/3rd` or `/3/5`).
 */
const RATING = /(?<=^|\s)\/([1-5])(?![\w/])/m

type RatingToken = { type: 'rating'; raw: string; stars: number }

/** `count` stars, as given in a rating. */
export const stars = (count: number) => '⭐'.repeat(count)

/** `text` with each rating swapped for its stars, for plain text. */
export function replaceRatings(text: string) {
  return text.replace(new RegExp(RATING, 'gm'), (_, digit: string) =>
    stars(Number(digit)),
  )
}

/**
 * Renders a rating as that many star emojis, read out as "3 stars". A backslash before it (`\/3`) keeps
 * it as typed.
 */
export const ratingExtension: TokenizerAndRendererExtension = {
  name: 'rating',
  level: 'inline',
  start: (src) => src.match(RATING)?.index,
  tokenizer(src, tokens): RatingToken | undefined {
    // `src` starts where the text before it ended, so whether a space comes first is up to that text.
    const before = tokens.at(-1)?.raw
    if (before && !/\s$/.test(before)) return
    const match = /^\/([1-5])(?![\w/])/.exec(src)
    if (match) return { type: 'rating', raw: match[0], stars: Number(match[1]) }
  },
  renderer(token) {
    const count = (token as RatingToken).stars
    const label = count === 1 ? '1 star' : `${count} stars`
    return `<span role="img" aria-label="${label}">${stars(count)}</span>`
  },
}
