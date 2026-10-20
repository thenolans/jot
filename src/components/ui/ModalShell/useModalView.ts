import { type RefObject, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

import { afterMenuCloses } from '@/components/ui/Menu'

type Direction = 'forward' | 'back'

const viewClassNames = {
  forward: 'motion-safe:animate-view-in',
  back: 'motion-safe:animate-view-back',
} satisfies Record<Direction, string>

/**
 * The view a `ModalShell` shows, for a modal whose content changes in place: a main view, and views
 * opened from it that go back to it (a note, then the confirmation to delete it). `show` opens a view
 * and `back` returns to the main one. Either way the panel resizes to fit the new view, which slides in
 * (from the end going forward, from the start going back), and going back returns focus to what opened
 * the view (or the first control, if that's gone).
 *
 * Give each view `viewClassName`. Keep the main view mounted while another shows, hidden, so it keeps
 * its state (what's typed, where it's scrolled), and render the others only while they show, in a
 * `ModalSubview`. While `isMainView` is false, pass `back` as the shell's `onEscape`, so Esc goes back
 * rather than closing.
 */
export function useModalView<View extends string>(
  dialogRef: RefObject<HTMLDialogElement | null>,
  mainView: View,
) {
  const [view, setView] = useState(mainView)
  const [direction, setDirection] = useState<Direction>()
  const opener = useRef<HTMLElement | null>(null)

  const go = (next: View, nextDirection: Direction) => {
    const panel = dialogRef.current?.firstElementChild
    const from = panel?.getBoundingClientRect()
    flushSync(() => {
      setView(next)
      setDirection(nextDirection)
    })
    if (
      !(panel instanceof HTMLElement) ||
      !from ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return

    // The panel grows or shrinks from its old size to its new one. Its size limits are lifted meanwhile,
    // or they'd hold it at the new view's size, and it clips the new view until it fits.
    const to = panel.getBoundingClientRect()
    const size = ({ width, height }: DOMRect) => ({
      width: `${width}px`,
      height: `${height}px`,
      minWidth: '0',
      maxWidth: 'none',
      minHeight: '0',
      maxHeight: 'none',
      overflow: 'clip',
    })
    // It takes as long as the views' slide-in (`animate-view-in`, `animate-view-back`), so they finish together.
    panel.animate([size(from), size(to)], {
      duration: parseFloat(
        getComputedStyle(panel).getPropertyValue('--duration-long'),
      ),
      easing: 'ease',
    })
  }

  // Picked from a menu, the view waits for the menu to close and hand focus back to its button, or the
  // closing menu would take focus back from the new view.
  const show = (next: View) =>
    afterMenuCloses((element) => {
      opener.current = element
      go(next, 'forward')
    })

  // What opened the view may have gone with what it did (a folder moved or deleted from its menu); then
  // focus goes to the panel's first control.
  const back = () => {
    go(mainView, 'back')
    if (opener.current?.isConnected) opener.current.focus()
    else
      dialogRef.current
        ?.querySelector<HTMLElement>('button, [href], input, textarea')
        ?.focus()
  }

  return {
    view,
    isMainView: view === mainView,
    show,
    back,
    /** Slides the view in as it shows. */
    viewClassName: direction && viewClassNames[direction],
  }
}
