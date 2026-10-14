import { useState } from 'react'

import { readTheme, saveTheme, type Theme } from './theme'

/** The chosen theme and a setter that applies and remembers it. */
export function useTheme() {
  const [theme, setThemeState] = useState(readTheme)

  const setTheme = (next: Theme) => {
    saveTheme(next)
    setThemeState(next)
  }

  return [theme, setTheme] as const
}
