import { replaceRatings } from './rating'

/** The most of a note's text a card shows; the card's line clamp cuts it shorter. */
const PREVIEW_LENGTH = 600

/**
 * A note's content as plain text for a card: markdown's markup taken out (heading and quote markers,
 * emphasis, code ticks, link and image syntax, task boxes), keeping its lines and list numbers and bullets.
 * Ratings become stars.
 */
export function notePreview(content: string) {
  return stripInlineMarkdown(
    replaceRatings(content.slice(0, PREVIEW_LENGTH * 2))
      .replace(/^[ \t]*(#{1,6}|>)[ \t]+/gm, '')
      .replace(/^([ \t]*[-*+][ \t]+)\[[ xX]\][ \t]+/gm, '$1'),
  )
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, PREVIEW_LENGTH)
}

/** `text` without markdown's inline markup: images and links keep their text, and emphasis and code ticks go. */
export function stripInlineMarkdown(text: string) {
  return (
    text
      // Images, then links, keep their text.
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/(\*\*|__|~~)(?=\S)(.+?)(?<=\S)\1/g, '$2')
      .replace(/(?<![\w*])([*_])(?=\S)(.+?)(?<=\S)\1(?![\w*])/g, '$2')
      .replace(/`+/g, '')
  )
}

/** How many lines of preview a card shows: more for longer notes, so cards vary in height like the notes do. */
export function previewLines(preview: string): 3 | 5 | 7 | 9 {
  const { length } = preview
  return length < 80 ? 3 : length < 220 ? 5 : length < 400 ? 7 : 9
}
