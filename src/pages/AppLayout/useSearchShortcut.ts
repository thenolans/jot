import { useEffect, useEffectEvent } from 'react'

import { isApple } from '@/lib/platform'

/** The search shortcut, as `aria-keyshortcuts` names it. */
export const searchShortcut = isApple ? 'Meta+K' : 'Control+K'

/** Calls `onSearch` when ⌘K (Ctrl+K off Apple devices) is pressed anywhere. */
export function useSearchShortcut(onSearch: () => void) {
  const handleSearch = useEffectEvent(onSearch)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const modifier = isApple ? event.metaKey : event.ctrlKey
      if (
        !modifier ||
        event.altKey ||
        event.shiftKey ||
        event.key.toLowerCase() !== 'k'
      )
        return
      event.preventDefault()
      handleSearch()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
