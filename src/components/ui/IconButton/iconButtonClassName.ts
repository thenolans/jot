import { cx } from '@/lib/cx'

export type IconButtonStyleProps = {
  variant?: 'quiet' | 'outlined' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const base =
  'inline-flex flex-none items-center justify-center rounded-sm cursor-pointer transition-colors disabled:cursor-default disabled:opacity-50'

const sizes = {
  sm: 'size-6',
  md: 'size-8',
  lg: 'size-10',
} satisfies Record<NonNullable<IconButtonStyleProps['size']>, string>

const variants = {
  // Faint until hovered, for secondary controls like closing a dialog.
  quiet:
    'text-faint hover:bg-border-soft hover:text-ink disabled:hover:bg-transparent disabled:hover:text-faint',
  // A round, raised button that stands on top of content, like a scroll arrow.
  outlined:
    'rounded-full border border-border bg-surface text-ink-strong shadow-card',
  // Faint until hovered, then red, for removing things.
  danger:
    'text-faint hover:bg-danger-soft hover:text-danger disabled:hover:bg-transparent disabled:hover:text-faint',
} satisfies Record<NonNullable<IconButtonStyleProps['variant']>, string>

/** Class names for an icon-only button, including ones rendered by other libraries. */
export function iconButtonClassName(
  { variant = 'quiet', size = 'md' }: IconButtonStyleProps,
  className?: string,
) {
  return cx(base, sizes[size], variants[variant], className)
}
