/** A replacement of the text between `start` and `end`. */
export type TextEdit = {
  start: number
  end: number
  text: string
}

// A list item's marker at the start of a line: its indent, a bullet or number, the space after it,
// and a task box if it has one.
const LIST_ITEM = /^(\s*)([-*+]|(\d+)([.)]))(\s+)(\[[ xX]\]\s+)?/

/**
 * What pressing Enter at `cursor` in `text` should do inside a markdown list: start the next item
 * (the next number in a numbered list, an empty box in a task list), or, on an item with nothing
 * written after its marker, end the list by clearing the marker. `null` when the cursor isn't after
 * a list item's marker, so Enter just breaks the line.
 */
export function continueList(text: string, cursor: number): TextEdit | null {
  const lineStart = text.lastIndexOf('\n', cursor - 1) + 1
  const lineEnd = text.indexOf('\n', cursor)
  const line = text.slice(lineStart, lineEnd === -1 ? undefined : lineEnd)
  const match = LIST_ITEM.exec(line)
  if (!match || cursor - lineStart < match[0].length) return null

  const [marker, indent, bullet, number, delimiter, space, task] = match
  if (!line.slice(marker.length).trim()) {
    return { start: lineStart, end: lineStart + line.length, text: '' }
  }

  const nextBullet = number ? `${Number(number) + 1}${delimiter}` : bullet
  return {
    start: cursor,
    end: cursor,
    text: `\n${indent}${nextBullet}${space}${task ? '[ ] ' : ''}`,
  }
}
