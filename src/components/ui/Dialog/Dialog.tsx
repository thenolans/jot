import { type ReactNode, type RefObject, useId, useRef } from 'react'

import CloseIcon from '@/components/icons/CloseIcon'
import Heading from '@/components/ui/Heading'
import IconButton from '@/components/ui/IconButton'
import ModalShell, { closeModal } from '@/components/ui/ModalShell'
import SheetHandle from '@/components/ui/SheetHandle'
import { cx } from '@/lib/cx'

type DialogProps = {
  title: ReactNode
  /** Called once it has closed, so it can be removed. */
  onClose: () => void
  /** From `useDialog`, for a dialog that closes itself. */
  dialogRef?: RefObject<HTMLDialogElement | null>
  children: ReactNode
  /** Classes for the panel, e.g. to change its width. */
  className?: string
}

/**
 * A modal panel with a title and a close button. Render it to open it; it closes on Esc, the close
 * button or a click outside, animating out, then calls `onClose` so it can be removed. To close it from
 * inside (a cancel button, a save), use `useDialog`'s `close` rather than `onClose`. Below `md` it's a
 * sheet that slides up from the bottom edge, full width; from `md` it's centered.
 */
export default function Dialog({
  title,
  onClose,
  dialogRef: givenRef,
  children,
  className,
}: DialogProps) {
  const ownRef = useRef<HTMLDialogElement>(null)
  const dialogRef = givenRef ?? ownRef
  const titleId = useId()

  const close = () => closeModal(dialogRef.current)

  return (
    <ModalShell
      dialogRef={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      // The gap above the sheet leaves some of the page in view, and a tap there closes it. The panel
      // scrolls itself, so the dialog clips it as it slides in from below. Clip, not hidden: hidden still
      // scrolls to show the focused button, which cancels the slide.
      className="flex items-end justify-center overflow-clip pt-12 md:items-center md:p-4"
      panelClassName={cx(
        'max-h-full w-full max-w-sm overflow-y-auto p-6',
        className,
        'max-md:max-w-none max-md:rounded-b-none max-md:pt-2 max-md:pb-safe-area-6 max-md:motion-safe:animate-sheet-in max-md:motion-safe:in-data-closing:animate-sheet-out',
      )}
    >
      <SheetHandle onClick={close} className="-mx-6 mb-2" />
      <div className="mb-4 flex items-center justify-between gap-2">
        <Heading as="h2" variant="subsection" id={titleId}>
          {title}
        </Heading>
        <IconButton
          size="lg"
          onClick={close}
          aria-label="Close"
          className="-mr-2"
        >
          <CloseIcon size={20} />
        </IconButton>
      </div>
      {children}
    </ModalShell>
  )
}
