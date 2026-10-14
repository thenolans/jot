import type { ComponentProps, ElementType } from 'react'

import { cx } from '@/lib/cx'

type CardElement = 'div' | 'section' | 'article' | 'ul'

const variantClassNames = {
  /** A standalone card holding content: a note, a form section, a page's main panel. */
  panel: 'rounded-sm shadow-card',
  /** A compact card flush with what's around it: a list of rows, a small panel of facts, or a card inside another surface. */
  inset: 'rounded-sm',
}

type CardProps<T extends CardElement> = {
  /** The element to render, so the card can be a section, article or list. */
  as?: T
  /** Sets the corner radius and shadow; see `variantClassNames` for which to use. */
  variant?: keyof typeof variantClassNames
} & Omit<ComponentProps<T>, 'as'>

/** A bordered surface that groups content. Layout and padding are left to the `className`. */
export default function Card<T extends CardElement = 'div'>({
  as,
  variant = 'panel',
  className,
  ...props
}: CardProps<T>) {
  const Element = (as ?? 'div') as ElementType

  return (
    <Element
      className={cx(
        'border border-border bg-surface',
        variantClassNames[variant],
        className,
      )}
      {...props}
    />
  )
}
