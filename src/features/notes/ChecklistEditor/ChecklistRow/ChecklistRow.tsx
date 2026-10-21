import type {
  ClipboardEventHandler,
  KeyboardEventHandler,
  ReactNode,
  Ref,
} from 'react'

import CloseIcon from '@/components/icons/CloseIcon'
import Checkbox from '@/components/ui/Checkbox'
import IconButton from '@/components/ui/IconButton'
import { cx } from '@/lib/cx'

import type { ChecklistItem } from '../../checklist'

// A checked item stays crossed off in place for a moment, then fades out (`animate-fade-out`, at
// `--duration-short`) and folds away with the completed items.
export const SETTLE_MS = 480
const FADE_OUT_MS = 160

export type ChecklistRowProps = {
  item: ChecklistItem
  /** Can't be checked off, changed or removed. */
  readOnly: boolean
  /** Checked off a moment ago, so it's fading out before it folds away. */
  isSettling: boolean
  /** The drag handle, or a space its size for a row that can't be dragged; none when read only. */
  handle?: ReactNode
  isDragging?: boolean
  rowRef?: Ref<HTMLLIElement>
  inputRef: Ref<HTMLInputElement>
  onToggle: () => void
  onTextChange: (text: string) => void
  onKeyDown: KeyboardEventHandler<HTMLInputElement>
  onPaste: ClipboardEventHandler<HTMLInputElement>
  onRemove: () => void
}

/** One item of a checklist: its box, its text, typed in where it is, and a button to delete it. */
export default function ChecklistRow({
  item,
  readOnly,
  isSettling,
  handle,
  isDragging = false,
  rowRef,
  inputRef,
  onToggle,
  onTextChange,
  onKeyDown,
  onPaste,
  onRemove,
}: ChecklistRowProps) {
  return (
    <li
      ref={rowRef}
      className={cx(
        'flex items-center gap-1 rounded-sm bg-surface',
        isSettling && 'animate-fade-out',
        isDragging && 'relative z-10 shadow-lifted',
      )}
      style={
        isSettling
          ? { animationDelay: `${SETTLE_MS - FADE_OUT_MS}ms` }
          : undefined
      }
    >
      {handle}
      <Checkbox
        aria-label={item.text ? `Check off ${item.text}` : 'Check off'}
        checked={item.done}
        disabled={readOnly}
        onChange={onToggle}
      />
      {/* Borderless like the rest of the note, with the caret marking focus. */}
      <input
        ref={inputRef}
        name="item"
        aria-label="List item"
        placeholder="List item"
        value={item.text}
        readOnly={readOnly}
        spellCheck={false}
        enterKeyHint="next"
        onChange={(event) => onTextChange(event.target.value)}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        className={cx(
          'ml-1 min-w-0 flex-1 bg-transparent py-2 text-ink outline-none placeholder:text-faint focus-visible:shadow-none',
          item.done && 'text-faint line-through',
        )}
      />
      {!readOnly && (
        <IconButton
          variant="danger"
          aria-label={item.text ? `Delete ${item.text}` : 'Delete item'}
          onClick={onRemove}
          className={cx('-mr-2', isDragging && 'invisible')}
        >
          <CloseIcon size={16} />
        </IconButton>
      )}
    </li>
  )
}
