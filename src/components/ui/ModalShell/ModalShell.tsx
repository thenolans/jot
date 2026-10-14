import {
  type ComponentProps,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
  type SyntheticEvent,
  useEffect,
  useRef,
} from 'react'

import { cx } from '@/lib/cx'

import { closeModal } from './closeModal'

type ModalShellProps = Omit<
  ComponentProps<'dialog'>,
  'ref' | 'onClose' | 'onClick' | 'className'
> & {
  /** The dialog element; pass it to `closeModal` to close it. */
  dialogRef: RefObject<HTMLDialogElement | null>
  onClose: () => void
  children: ReactNode
  /** Classes for the full-screen dialog, e.g. to position the panel. */
  className?: string
  /** Classes for the panel, e.g. to set its size and padding. */
  panelClassName?: string
}

/**
 * A bare modal: a backdrop and an empty panel. Render it to open it; it closes on Esc or a click
 * outside the panel, then calls `onClose` so it can be removed. Close it from inside with
 * `closeModal`, which plays the exit animation first (`in-data-closing:` styles the panel's).
 */
export default function ModalShell({
  dialogRef,
  onClose,
  children,
  className,
  panelClassName,
  ...props
}: ModalShellProps) {
  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [dialogRef])

  // Only the area around the panel is the dialog itself; presses in the panel or a popover land on them.
  // A click counts only if it also started there: one that opens a popover ends on the popover's
  // backdrop, so the browser aims it at the dialog, their common ancestor.
  const pressedOutside = useRef(false)
  const handlePointerDown = (event: PointerEvent) => {
    pressedOutside.current = event.target === event.currentTarget
  }
  const handleDialogClick = (event: MouseEvent) => {
    if (pressedOutside.current && event.target === event.currentTarget)
      closeModal(dialogRef.current)
  }
  // Esc animates out too. The browser may refuse to let a repeated Esc be held back; then it closes at once.
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault()
    closeModal(event.currentTarget)
  }

  return (
    <dialog
      {...props}
      ref={dialogRef}
      onClose={onClose}
      onCancel={handleCancel}
      onPointerDown={handlePointerDown}
      onClick={handleDialogClick}
      className={cx(
        'fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-ink not-open:hidden backdrop:animate-fade-in backdrop:bg-overlay data-closing:pointer-events-none motion-safe:data-closing:backdrop:animate-fade-out motion-reduce:backdrop:animate-none',
        className,
      )}
    >
      <div
        className={cx(
          'animate-rise-in rounded-md bg-surface shadow-raised motion-safe:in-data-closing:animate-rise-out motion-reduce:animate-none',
          panelClassName,
        )}
      >
        {children}
      </div>
    </dialog>
  )
}
