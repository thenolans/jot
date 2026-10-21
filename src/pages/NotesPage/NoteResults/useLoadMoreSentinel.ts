import { useEffect, useRef } from 'react'

/** How far below the window the end of the list starts the next page, so it's usually there before it's scrolled to. */
const LOAD_AHEAD = '0px 0px 800px 0px'

/**
 * A ref for an element at the end of a list, which calls `loadMore` whenever it comes near the window.
 * It checks again whenever `loaded` changes, so a page too short to push it out of view loads another.
 */
export function useLoadMoreSentinel(
  loadMore: () => void,
  enabled: boolean,
  loaded: number,
) {
  const ref = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef(loadMore)
  useEffect(() => {
    loadMoreRef.current = loadMore
  })

  useEffect(() => {
    const sentinel = ref.current
    if (!enabled || !sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMoreRef.current()
      },
      { rootMargin: LOAD_AHEAD },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [enabled, loaded])

  return ref
}
