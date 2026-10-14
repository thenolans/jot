/**
 * Closes a `ModalShell`'s dialog after its exit animation: marks it `data-closing`, which plays the
 * animations, waits for the panel's and the backdrop's to end, then closes it, which calls its
 * `onClose`. Does nothing if it's closed or already closing. With reduced motion it closes at once.
 */
export async function closeModal(dialog: HTMLDialogElement | null) {
  if (!dialog?.open || dialog.hasAttribute('data-closing')) return
  dialog.setAttribute('data-closing', '')

  // Only the panel's and backdrop's own animations: one inside the panel, like a spinner, may never end.
  const panel = dialog.firstElementChild
  const exits = dialog.getAnimations({ subtree: true }).filter(({ effect }) => {
    const { target, pseudoElement } = effect as KeyframeEffect
    return target === dialog || (target === panel && !pseudoElement)
  })
  await Promise.allSettled(exits.map((animation) => animation.finished))

  dialog.close()
  dialog.removeAttribute('data-closing')
}
