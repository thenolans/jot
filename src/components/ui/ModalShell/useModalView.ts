import { type RefObject, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

type Direction = 'forward' | 'back'

/** Matches the views' slide-in (`animate-view-in`, `animate-view-back`), so they finish together. */
const RESIZE_MS = 240

const viewClassNames = {
  forward: 'motion-safe:animate-view-in',
  back: 'motion-safe:animate-view-back',
} satisfies Record<Direction, string>

/** How long a view opened from a menu waits for the menu to close, in case focus doesn't come back. */
const MENU_CLOSE_TIMEOUT_MS = 500

/** The button of the menu that has focus, if one does. */
function focusedMenuButton() {
  const menu = document.activeElement?.closest('[role="menu"]')
  return menu?.id
    ? document.querySelector<HTMLElement>(`[aria-controls="${menu.id}"]`)
    : null
}

/**
 * The view a `ModalShell` shows, for a modal whose content changes in place: a main view, and views
 * opened from it that go back to it (a note, then the confirmation to delete it). `show` opens a view
 * and `back` returns to the main one. Either way the panel resizes to fit the new view, which slides in
 * (from the end going forward, from the start going back), and going back returns focus to what opened
 * the view.
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
    panel.animate([size(from), size(to)], {
      duration: RESIZE_MS,
      easing: 'ease',
    })
  }

  const show = (next: View) => {
    const menuButton = focusedMenuButton()
    opener.current = menuButton ?? (document.activeElement as HTMLElement)
    if (!menuButton) return go(next, 'forward')

    // Picked from a menu, the view waits for the menu to close and hand focus back to its button, or the
    // closing menu would take focus back from the new view.
    let isShown = false
    const showOnce = () => {
      if (isShown) return
      isShown = true
      go(next, 'forward')
    }
    menuButton.addEventListener('focus', showOnce, { once: true })
    setTimeout(showOnce, MENU_CLOSE_TIMEOUT_MS)
  }

  const back = () => {
    go(mainView, 'back')
    opener.current?.focus()
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
