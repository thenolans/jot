import { cx } from '@/lib/cx'

export type InputStyleProps = {
  /** Whether the input is a cell in an `InputGroup`, which rounds only its outer corners. */
  inGroup?: boolean
}

// The text sets the height, not a fixed or minimum height, so textareas grow while one line matches
// an `h-10` button: a 22px line, 16px of padding and a 1px border on each side make 40px. The line
// height is what's off the 8pt grid (type is exempt), so the padding stays on it. Phones get 16px
// text (`text-lg`), since iOS zooms into a focused input whose text is smaller.
const base =
  'w-full min-w-0 border border-border bg-surface px-4 py-2 text-lg leading-5.5 sm:text-base text-ink transition-colors placeholder:text-faint hover:border-accent-mid focus-visible:border-accent-mid aria-invalid:border-danger'

/** Class names for a text input, textarea or select, styled to sit in a `Field` or an `InputGroup`. */
export function inputClassName(
  { inGroup = false }: InputStyleProps = {},
  className?: string,
) {
  // A cell takes its corners from its field, which the group's layout rounds at the outer edges.
  return cx(base, inGroup ? 'rounded-inherit' : 'rounded-sm', className)
}
