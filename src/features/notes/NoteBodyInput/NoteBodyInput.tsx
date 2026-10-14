import type { ComponentProps, KeyboardEvent } from 'react'

import { continueList } from './continueList'

type NoteBodyInputProps = ComponentProps<'textarea'>

/** A textarea for a note's markdown, which carries a list on to the next line when Enter is pressed. */
export default function NoteBodyInput({
  onKeyDown,
  ...props
}: NoteBodyInputProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    onKeyDown?.(event)
    const textarea = event.currentTarget
    if (
      event.defaultPrevented ||
      event.key !== 'Enter' ||
      event.shiftKey ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.nativeEvent.isComposing ||
      textarea.selectionStart !== textarea.selectionEnd
    )
      return

    const edit = continueList(textarea.value, textarea.selectionStart)
    if (!edit) return

    event.preventDefault()
    textarea.setRangeText(edit.text, edit.start, edit.end, 'end')
    // Edited outside of typing, so tell React the value changed, which calls `onChange`.
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
  }

  return <textarea onKeyDown={handleKeyDown} {...props} />
}
