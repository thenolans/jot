import { iconButtonClassName } from '@/components/ui/IconButton'
import { cx } from '@/lib/cx'

/** Class names for one item of the pagination: a page number or a previous/next arrow, shaped like an icon button. */
export function pageItemClassName(active = false, className?: string) {
  return iconButtonClassName(
    { variant: 'quiet' },
    // Muted rather than the quiet button's faint, so page numbers read clearly as text.
    cx(
      'font-display text-sm font-bold text-muted',
      active && 'bg-accent text-on-accent hover:bg-accent hover:text-on-accent',
      className,
    ),
  )
}
