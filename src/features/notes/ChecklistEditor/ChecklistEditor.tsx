import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers'
import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import {
  type ClipboardEvent,
  type KeyboardEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import ChevronRightIcon from '@/components/icons/ChevronRightIcon'
import PlusIcon from '@/components/icons/PlusIcon'
import Button from '@/components/ui/Button'
import { iconButtonClassName } from '@/components/ui/IconButton'
import { cx } from '@/lib/cx'
import { plural } from '@/lib/plural'

import {
  checklistContent,
  type ChecklistItem,
  checklistItems,
} from '../checklist'
import { rowPlugins } from './accessibility'
import ChecklistRow, { SETTLE_MS } from './ChecklistRow'
import { moveRow } from './rows'
import SortableChecklistRow from './SortableChecklistRow'

/** An item with a key that stays put as items are added, checked off and removed. */
type Item = ChecklistItem & { key: number }

let lastKey = 0

const withKey = (item: ChecklistItem): Item => ({ ...item, key: ++lastKey })

/** Where the caret goes after a change: into the item with `key`, at `caret`. */
type Caret = { key: number; caret: number }

type ChecklistEditorProps = {
  /** The checklist's markdown, a task per item (see `checklist.ts`). */
  content: string
  onChange: (content: string) => void
  /** Items can't be checked off, changed, added or removed. */
  readOnly?: boolean
  /**
   * Items can't be changed for now, but show as they will once they can (handles and all), so nothing
   * moves when they're enabled.
   */
  disabled?: boolean
  className?: string
}

/**
 * A checklist note's items, each checked off and typed in where it is, with nothing to switch between
 * reading and editing. Checked items cross off, then fold into a completed section below, which can be
 * collapsed; unchecking one puts it back in its place. Enter starts the next item, Backspace at the
 * start of one joins it to the one above, the arrow keys move between them and pasting several lines
 * makes an item of each. There's at most one empty item, so adding goes to it if there is one. Items
 * still to do can be dragged into a new order by their handles.
 */
export default function ChecklistEditor({
  content,
  onChange,
  readOnly = false,
  disabled = false,
  className,
}: ChecklistEditorProps) {
  const [items, setItems] = useState(() => checklistItems(content).map(withKey))
  // The content the items were last read from or written as. When it's changed from outside (edited on
  // another device), the items are read again, keeping their keys by position so typing isn't
  // interrupted.
  const [read, setRead] = useState(content)
  if (content !== read) {
    setRead(content)
    setItems(
      checklistItems(content).map((item, index) =>
        items[index] ? { ...item, key: items[index].key } : withKey(item),
      ),
    )
  }

  const [showCompleted, setShowCompleted] = useState(true)
  // Items checked off a moment ago, still crossed off in place.
  const [settling, setSettling] = useState<number[]>([])
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  // Made once: the provider takes its plugins when it's created.
  const todoCount = useRef(0)
  const [plugins] = useState(() =>
    rowPlugins(
      'item',
      (_group, index) => `position ${index + 1} of ${todoCount.current}`,
    ),
  )

  const inputs = useRef(new Map<number, HTMLInputElement>())
  const [caret, setCaret] = useState<Caret | null>(null)
  const placeCaret = ({ key, caret }: Caret) => {
    const input = inputs.current.get(key)
    input?.focus()
    input?.setSelectionRange(caret, caret)
  }
  useLayoutEffect(() => {
    if (caret) placeCaret(caret)
  }, [caret])

  // Every change goes through here, so while disabled, the buttons that make one do nothing.
  function save(next: Item[], caretAfter?: Caret) {
    if (disabled) return
    const written = checklistContent(next)
    setItems(next)
    setRead(written)
    onChange(written)
    if (caretAfter) setCaret(caretAfter)
  }

  const isSettling = (item: Item) => settling.includes(item.key)
  const todo = items.filter((item) => !item.done || isSettling(item))
  const completed = items.filter((item) => item.done && !isSettling(item))
  useLayoutEffect(() => {
    todoCount.current = todo.length
  })
  // The items in the order they show, for moving between them.
  const shown = showCompleted ? [...todo, ...completed] : todo

  function toggle(item: Item) {
    save(items.map((i) => (i.key === item.key ? { ...i, done: !i.done } : i)))
    if (item.done) {
      setSettling((keys) => keys.filter((key) => key !== item.key))
      return
    }
    setSettling((keys) => [...keys, item.key])
    timers.current.push(
      setTimeout(
        () => setSettling((keys) => keys.filter((key) => key !== item.key)),
        SETTLE_MS,
      ),
    )
  }

  function add() {
    const blank = items.find((item) => !item.done && !item.text.trim())
    if (blank) {
      setCaret({ key: blank.key, caret: 0 })
      return
    }
    // After the last item still to do, so it shows at the end of them.
    const added = withKey({ text: '', done: false })
    const at = items.findLastIndex((item) => !item.done) + 1
    save([...items.slice(0, at), added, ...items.slice(at)], {
      key: added.key,
      caret: 0,
    })
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>, item: Item) {
    if (readOnly || event.nativeEvent.isComposing) return
    const { selectionStart, selectionEnd } = event.currentTarget
    const start = selectionStart ?? item.text.length
    const end = selectionEnd ?? start
    const at = shown.indexOf(item)

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      // The empty item is the one place to type, so it doesn't make another.
      if (!item.text.trim()) return
      const added = withKey({ text: item.text.slice(end), done: false })
      const next = items
        .flatMap((i) =>
          i.key === item.key
            ? [{ ...i, text: i.text.slice(0, start) }, added]
            : [i],
        )
        // The new item replaces any other empty one.
        .filter(
          (i) => i.text.trim() || i.key === added.key || i.key === item.key,
        )
      save(next, { key: added.key, caret: 0 })
    } else if (event.key === 'Backspace' && end === 0 && at > 0) {
      event.preventDefault()
      const previous = shown[at - 1]
      save(
        items
          .filter((i) => i.key !== item.key)
          .map((i) =>
            i.key === previous.key ? { ...i, text: i.text + item.text } : i,
          ),
        { key: previous.key, caret: previous.text.length },
      )
    } else if (
      (event.key === 'ArrowUp' && at > 0) ||
      (event.key === 'ArrowDown' && at < shown.length - 1)
    ) {
      event.preventDefault()
      const target = shown[at + (event.key === 'ArrowUp' ? -1 : 1)]
      placeCaret({
        key: target.key,
        caret: Math.min(start, target.text.length),
      })
    }
  }

  // Several lines pasted into an item become an item each, the first joining the text before the
  // caret and the last the text after it.
  function handlePaste(event: ClipboardEvent<HTMLInputElement>, item: Item) {
    const text = event.clipboardData.getData('text')
    const lines = text.includes('\n') ? checklistItems(text) : []
    if (readOnly || lines.length < 2) return
    event.preventDefault()
    const { selectionStart, selectionEnd } = event.currentTarget
    const before = item.text.slice(0, selectionStart ?? item.text.length)
    const after = item.text.slice(selectionEnd ?? item.text.length)
    const last = lines.length - 1
    const pasted = lines.map((line, index) => ({
      ...(index === 0 ? item : withKey(line)),
      text:
        (index === 0 ? before : '') + line.text + (index === last ? after : ''),
      done: index === 0 ? item.done || line.done : line.done,
    }))
    save(
      items.flatMap((i) => (i.key === item.key ? pasted : [i])),
      { key: pasted[last].key, caret: pasted[last].text.length - after.length },
    )
  }

  // Rows still to do can be dragged into a new order; dropping one moves it among them, leaving the
  // completed items in their places among the rest.
  function reorder(from: number, to: number) {
    const moved = moveRow(todo, from, to)
    let next = 0
    save(items.map((item) => (todo.includes(item) ? moved[next++] : item)))
  }

  const rowProps = (item: Item) => ({
    item,
    readOnly,
    disabled,
    isSettling: isSettling(item),
    inputRef: (input: HTMLInputElement | null) => {
      if (input) inputs.current.set(item.key, input)
      return () => {
        inputs.current.delete(item.key)
      }
    },
    onToggle: () => toggle(item),
    onTextChange: (text: string) =>
      save(items.map((i) => (i.key === item.key ? { ...i, text } : i))),
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) =>
      handleKeyDown(event, item),
    onPaste: (event: ClipboardEvent<HTMLInputElement>) =>
      handlePaste(event, item),
    onRemove: () => save(items.filter((i) => i.key !== item.key)),
  })

  return (
    <div className={className}>
      {todo.length > 0 &&
        (readOnly ? (
          <ul>
            {todo.map((item) => (
              <ChecklistRow key={item.key} {...rowProps(item)} />
            ))}
          </ul>
        ) : (
          <DragDropProvider
            modifiers={[RestrictToVerticalAxis]}
            plugins={plugins}
            onDragEnd={({ operation: { source }, canceled }) => {
              // Rows are reordered on screen as they're dragged, and the list catches up on the drop.
              if (canceled || !isSortable(source)) return
              reorder(source.initialIndex, source.index)
            }}
          >
            <ul>
              {todo.map((item, index) => (
                <SortableChecklistRow
                  key={item.key}
                  id={item.key}
                  index={index}
                  {...rowProps(item)}
                />
              ))}
            </ul>
          </DragDropProvider>
        ))}
      {!readOnly ? (
        <button
          type="button"
          onClick={add}
          // Lines the plus up with the items' boxes, after the drag handles.
          className="flex h-10 w-full cursor-text items-center gap-2 rounded-xs pl-8 text-faint transition-colors hover:text-muted"
        >
          <span className="flex size-5 items-center justify-center">
            <PlusIcon size={16} />
          </span>
          {/* Lines up with the items' text. */}
          <span className="ml-1">List item</span>
        </button>
      ) : (
        !items.length && <p className="text-faint italic">Empty list.</p>
      )}
      {completed.length > 0 && (
        <div className="mt-2 border-t border-border pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-expanded={showCompleted}
              onClick={() => setShowCompleted(!showCompleted)}
              // Lines the chevron up with the items' boxes, which sit after the drag handles unless read only.
              className={cx(
                'flex h-10 items-center gap-2 rounded-sm font-display text-sm font-bold text-muted transition-colors hover:text-accent',
                readOnly ? '-ml-1 px-1' : 'ml-6 px-2',
              )}
            >
              <ChevronRightIcon
                size={16}
                className={cx(
                  'transition-transform',
                  showCompleted && 'rotate-90',
                )}
              />
              {plural(completed.length, 'completed item')}
            </button>
            {!readOnly && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSettling([])
                  save(items.map((item) => ({ ...item, done: false })))
                }}
                // Cancels the padding, lining the text up with the delete buttons' icons.
                className="-mr-4 ml-auto"
              >
                Uncheck all
              </Button>
            )}
          </div>
          {showCompleted && (
            <ul>
              {completed.map((item) => (
                <ChecklistRow
                  key={item.key}
                  // Completed items can't be dragged, but line up with those that can.
                  handle={!readOnly && <HandleSpace />}
                  {...rowProps(item)}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

/** A drag handle's width, for rows that can't be dragged. */
function HandleSpace() {
  return <span className={iconButtonClassName({}, 'invisible -ml-2')} />
}
