import { useSyncExternalStore } from 'react'

// Tailwind's `lg` and `sm` breakpoints.
const threeColumns = '(min-width: 64rem)'
const twoColumns = '(min-width: 40rem)'

const subscribe = (onChange: () => void) => {
  const queries = [threeColumns, twoColumns].map((query) =>
    window.matchMedia(query),
  )
  for (const media of queries) media.addEventListener('change', onChange)
  return () => {
    for (const media of queries) media.removeEventListener('change', onChange)
  }
}

const columnCount = () =>
  window.matchMedia(threeColumns).matches
    ? 3
    : window.matchMedia(twoColumns).matches
      ? 2
      : 1

/** How many columns of notes fit the window: one on phones, two on tablets, three wider. */
export function useColumnCount() {
  return useSyncExternalStore(subscribe, columnCount)
}
