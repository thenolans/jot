export type Theme = 'light' | 'dark' | 'auto'

const THEME_STORAGE_KEY = 'jot.theme'

/** The theme the user picked on this device; `auto` follows the OS. */
export function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : 'auto'
  } catch {
    return 'auto'
  }
}

/** Remembers `theme` and applies it through `data-theme` on <html>, which the tokens follow. */
export function saveTheme(theme: Theme) {
  try {
    if (theme === 'auto') localStorage.removeItem(THEME_STORAGE_KEY)
    else localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Not remembered, but still applied for this visit.
  }
  applyTheme(theme)
}

export function applyTheme(theme: Theme) {
  if (theme === 'auto') delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = theme

  document
    .querySelector('meta[name="color-scheme"]')
    ?.setAttribute('content', theme === 'auto' ? 'light dark' : theme)

  // The status bar color (see index.html) has one tag per theme, each applying when the OS uses it.
  // A picked theme applies its own all the time.
  for (const meta of document.querySelectorAll<HTMLMetaElement>(
    'meta[name="theme-color"][data-scheme]',
  )) {
    const { scheme } = meta.dataset
    meta.media =
      theme === 'auto'
        ? `(prefers-color-scheme: ${scheme})`
        : scheme === theme
          ? 'all'
          : 'not all'
  }
}
