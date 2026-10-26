import { diff3Merge } from 'node-diff3'

import type { Note, NoteChanges, NoteText } from './types'

/** A note's title, text and whether it's a checklist. */
export function textOf({ title, content, isChecklist }: NoteText): NoteText {
  return { title, content, isChecklist }
}

/** The fields of `text` that differ from `from`, or `null` when none do. */
export function changesFrom(text: NoteText, from: NoteText) {
  const changes: NoteChanges = {}
  if (text.title !== from.title) changes.title = text.title
  if (text.content !== from.content) changes.content = text.content
  if (text.isChecklist !== from.isChecklist)
    changes.isChecklist = text.isChecklist
  return Object.keys(changes).length ? changes : null
}

/** Whether `saved` is `text` as the API saves it, which trims the title and text. */
export function isSavedAs(saved: Note, text: NoteText) {
  return (
    saved.title === text.title.trim() &&
    saved.content === text.content.trim() &&
    saved.isChecklist === text.isChecklist
  )
}

/** Splits text into words, punctuation and the whitespace between them, so joining the pieces gives it back. */
const words = (text: string) =>
  text.split(/(\s+|[^\s\p{L}\p{N}])/u).filter(Boolean)

/** `mine` and `theirs` merged word by word, or `null` when they change the same words. */
function mergeWords(base: string, mine: string, theirs: string) {
  const merged: string[] = []
  for (const region of diff3Merge(words(mine), words(base), words(theirs))) {
    if (!region.ok) return null
    merged.push(...region.ok)
  }
  return merged.join('')
}

/**
 * The changes `mine` and `theirs` each made to `base`, together, or `null` when they can't both be kept.
 * Lines changed on one side only are kept as they are. Where both changed the same or neighbouring lines,
 * the words in them are merged instead, so two edits in one paragraph merge unless they change the same
 * words. Text the API has saved since `base` was sent comes back trimmed, which isn't a change.
 */
export function mergeText(base: string, mine: string, theirs: string) {
  if (mine === base || mine === theirs) return theirs
  if (theirs === base || theirs === base.trim()) return mine
  const lines: string[] = []
  const regions = diff3Merge(
    mine.split('\n'),
    base.split('\n'),
    theirs.split('\n'),
  )
  for (const { ok, conflict } of regions) {
    if (ok) {
      lines.push(...ok)
      continue
    }
    if (!conflict) continue
    // Lines removed on one side and changed on the other can't both be kept.
    const { a, o, b } = conflict
    const merged =
      a.length && o.length && b.length
        ? mergeWords(o.join('\n'), a.join('\n'), b.join('\n'))
        : null
    if (merged === null) return null
    lines.push(merged)
  }
  return lines.join('\n')
}

/**
 * A note edited in two places since `base` (on this device as `mine`, and elsewhere as `theirs`), with
 * both edits kept, or `null` when they can't both be (see `mergeText`).
 */
export function mergeNote(
  base: NoteText,
  mine: NoteText,
  theirs: NoteText,
): NoteText | null {
  const title = mergeText(base.title, mine.title, theirs.title)
  const content = mergeText(base.content, mine.content, theirs.content)
  if (title === null || content === null) return null
  return {
    title,
    content,
    isChecklist:
      mine.isChecklist === base.isChecklist
        ? theirs.isChecklist
        : mine.isChecklist,
  }
}
