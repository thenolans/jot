import { stripInlineMarkdown } from './notePreview'

/** One item of a checklist note. */
export type ChecklistItem = {
  /** Plain text: an item's text isn't rendered as markdown. */
  text: string
  /** Checked off. */
  done: boolean
}

// What a line can start with, taken off to leave an item's text: a bullet or number with its task box,
// if any, a heading's hashes or a quote's arrow.
const LINE_MARKER =
  /^\s*(?:(?:[-*+]|\d+[.)])(?:\s+|$)(?:\[([ xX])\](?:\s+|$))?|#{1,6}\s+|>\s?)/

// Lines with no text to keep: code fences, horizontal rules and a table's divider row.
const BARE_LINE =
  /^\s*(?:```|~~~|([-*_])(?:\s*\1){2,}\s*$|\|?(?:\s*:?-+:?\s*\|)+\s*:?-*:?\s*$)/

/**
 * The items in a note's markdown, one per line with text. A checklist's content is a task per line
 * (`- [ ] …`, `- [x] …`), but any markdown works, for a note turned into a checklist or edited as
 * text elsewhere: each line's marker goes and its text stays, checked off only if it was a checked task.
 */
export function checklistItems(content: string): ChecklistItem[] {
  return content
    .split(/\r?\n/)
    .filter((line) => line.trim() && !BARE_LINE.test(line))
    .map((line) => {
      const marker = LINE_MARKER.exec(line)
      const box = marker?.[1]
      return {
        text: marker ? line.slice(marker[0].length) : line.trim(),
        done: !!box && box !== ' ',
      }
    })
}

/** A checklist's items as its content: a markdown task per item. */
export function checklistContent(items: ChecklistItem[]) {
  return items
    .map(({ text, done }) => `- [${done ? 'x' : ' '}] ${text}`)
    .join('\n')
}

/**
 * A note's markdown as a checklist's content, an item per line with text. Items are plain text, so
 * links, emphasis and code lose their markup.
 */
export function toChecklist(content: string) {
  return checklistContent(
    checklistItems(content).map((item) => ({
      ...item,
      text: stripInlineMarkdown(item.text),
    })),
  )
}

/** A checklist's content without its empty items. */
export function withoutEmptyItems(content: string) {
  return checklistContent(
    checklistItems(content).filter(({ text }) => text.trim()),
  )
}

/**
 * A checklist's content as markdown for a note that's no longer a checklist: a bulleted list, with
 * empty items left out. Which items were checked off isn't kept.
 */
export function fromChecklist(content: string) {
  return checklistItems(content)
    .filter(({ text }) => text.trim())
    .map(({ text }) => `- ${text}`)
    .join('\n')
}
