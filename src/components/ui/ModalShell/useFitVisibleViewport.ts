import { type RefObject, useEffect } from 'react'

/**
 * Keeps an element fixed over the part of the page that's in view, so it ends above the on-screen
 * keyboard. `dvh` doesn't shrink for the keyboard on iOS, which only shrinks (and may pan) the visual
 * viewport. Without `visualViewport`, the element keeps the size its classes give it.
 */
export function useFitVisibleViewport(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const viewport = window.visualViewport
    const element = ref.current
    if (!viewport || !element) return

    const fit = () => {
      element.style.top = `${viewport.offsetTop}px`
      element.style.height = `${viewport.height}px`
    }
    fit()
    viewport.addEventListener('resize', fit)
    viewport.addEventListener('scroll', fit)
    return () => {
      viewport.removeEventListener('resize', fit)
      viewport.removeEventListener('scroll', fit)
    }
  }, [ref])
}
