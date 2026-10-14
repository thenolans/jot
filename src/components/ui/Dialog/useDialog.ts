import { useRef } from 'react'

import { closeModal } from '@/components/ui/ModalShell'

/**
 * Lets a dialog close itself, from a cancel button or once it has saved: pass `dialogRef` to its
 * `Dialog` and call `close`, which plays the exit animation, then calls the dialog's `onClose`.
 */
export function useDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const close = () => closeModal(dialogRef.current)
  return { dialogRef, close }
}
