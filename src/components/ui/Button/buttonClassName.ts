import { cx } from '@/lib/cx'

export type ButtonStyleProps = {
  variant?:
    'primary' | 'secondary' | 'selected' | 'ghost' | 'danger' | 'danger-ghost'
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
}

const base =
  'inline-flex items-center justify-center gap-2 border border-transparent font-display font-bold cursor-pointer transition-colors disabled:cursor-default disabled:opacity-50'

const sizes = {
  // Pill-shaped, for standout calls to action.
  lg: 'h-12 px-6 text-lg rounded-full',
  // Matches text fields, for actions inside forms and app screens.
  md: 'h-10 px-4 text-sm rounded-sm',
  sm: 'h-8 px-4 text-sm rounded-sm',
} satisfies Record<NonNullable<ButtonStyleProps['size']>, string>

const variants = {
  primary: 'text-on-accent bg-accent hover:bg-accent-mid',
  secondary: 'text-ink bg-surface border-border hover:border-accent-mid',
  // A secondary button that's switched on, like a filter that's applied.
  selected:
    'text-accent bg-accent-soft border-accent-soft-border hover:border-accent-mid',
  ghost: 'text-accent bg-transparent hover:text-accent-mid',
  // Destructive actions, like confirming a discard.
  danger:
    'text-danger bg-danger-soft border-danger-soft-border hover:border-danger',
  // A quieter destructive action, like deleting from inside a form.
  'danger-ghost': 'text-danger bg-transparent hover:opacity-80',
} satisfies Record<NonNullable<ButtonStyleProps['variant']>, string>

/** Class names for anything styled as a button (buttons and links alike). */
export function buttonClassName(
  { variant = 'primary', size = 'md', block }: ButtonStyleProps,
  className?: string,
) {
  return cx(base, sizes[size], variants[variant], block && 'w-full', className)
}
