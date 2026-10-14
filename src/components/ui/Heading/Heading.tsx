import type { ComponentProps, ElementType } from 'react'

import { cx } from '@/lib/cx'

const variantClassNames = {
  /** The landing page headline. */
  hero: 'text-5xl font-black text-balance',
  /** The name of the thing a page is about, such as a note. */
  display: 'text-4xl font-black',
  /** A page's title. */
  title: 'text-3xl font-extrabold',
  /** A page's title when it sits in the top bar. */
  bar: 'text-lg font-extrabold',
  /** A section within a page. */
  section: 'text-2xl font-extrabold',
  /** A dialog or a panel within a section. */
  subsection: 'text-xl font-extrabold',
  /** The name on a card in a list. */
  card: 'text-lg leading-tight font-bold',
}

type HeadingElement = 'h1' | 'h2' | 'h3'

type HeadingProps<T extends HeadingElement> = {
  /** The heading level, which sets its place in the page outline but not its look. */
  as: T
  variant: keyof typeof variantClassNames
} & Omit<ComponentProps<T>, 'as'>

/** A page, section or card title. */
export default function Heading<T extends HeadingElement>({
  as,
  variant,
  className,
  ...props
}: HeadingProps<T>) {
  const Element = as as ElementType

  return (
    <Element
      className={cx(
        'font-display text-ink-strong',
        variantClassNames[variant],
        className,
      )}
      {...props}
    />
  )
}
