import { replaceRatings } from './rating'

/** The most of a note's text a card shows; the card's line clamp cuts it shorter. */
const PREVIEW_LENGTH = 1000

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

// About how many characters of preview fit on a line of a card.
const LINE_LENGTH = 40

// The most lines a long note's card shows, picked by the note so cards of long notes differ in height.
const MAX_LINES = [8, 10, 12, 14] as const

export type MaxPreviewLines = (typeof MAX_LINES)[number]

/**
 * The most lines of preview a note's card shows. A note longer than that is cut off there, so it varies
 * by note (by id, so a note keeps its height and notes made one after another differ), or a grid of long
 * notes would line up as one height.
 */
export function maxPreviewLines(id: number): MaxPreviewLines {
  return MAX_LINES[Math.abs(id) % MAX_LINES.length]
}

/** About how many lines of preview a note's card shows: its lines as they wrap, up to the note's maximum. */
export function previewLines(preview: string, id: number) {
  const lines = preview
    .split('\n')
    .reduce(
      (total, line) =>
        total + Math.max(1, Math.ceil(line.length / LINE_LENGTH)),
      0,
    )
  return Math.min(lines, maxPreviewLines(id))
}
