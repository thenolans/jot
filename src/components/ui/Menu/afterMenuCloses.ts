/** How long to wait for a closing menu to hand focus back, in case it doesn't. */
const MENU_CLOSE_TIMEOUT_MS = 500

/** The button of the menu that has focus, if one does. */
function focusedMenuButton() {
  const menu = document.activeElement?.closest('[role="menu"]')
  return menu?.id
    ? document.querySelector<HTMLElement>(`[aria-controls="${menu.id}"]`)
    : null
}

/**
 * Runs `callback` once the menu that has focus has closed and handed focus back to its button, or at once
 * when no menu has focus. A `MenuItem`'s action that moves focus (into a field, a dialog or another view)
 * runs through it, or the closing menu would take focus back. `callback` gets the element focus returned
 * to, to focus again later (going back from the view the action opened).
 */
export function afterMenuCloses(
  callback: (opener: HTMLElement | null) => void,
) {
  const menuButton = focusedMenuButton()
  if (!menuButton) return callback(document.activeElement as HTMLElement)

  let hasRun = false
  const runOnce = () => {
    if (hasRun) return
    hasRun = true
    callback(menuButton)
  }
  menuButton.addEventListener('focus', runOnce, { once: true })
  setTimeout(runOnce, MENU_CLOSE_TIMEOUT_MS)
}
