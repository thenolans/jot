import type { ComponentProps, ElementType } from 'react'

import { cx } from '@/lib/cx'

const widthClassNames = {
  /** A column of settings. */
  form: 'max-w-xl',
  /** A single thing to read or edit, such as a note. */
  narrow: 'max-w-4xl',
  /** A grid or board, such as the notes grid. */
  wide: 'max-w-6xl',
}

type PageContainerElement = 'div' | 'main'

type PageContainerProps<T extends PageContainerElement> = {
  width: keyof typeof widthClassNames
  /** The element to render, `main` when the page has no app shell around it; `div` by default. */
  as?: T
} & Omit<ComponentProps<T>, 'as'>

/** Centers a page's content at its width, with the page's side, top and bottom spacing. */
export default function PageContainer<T extends PageContainerElement = 'div'>({
  width,
  as,
  className,
  ...props
}: PageContainerProps<T>) {
  const Element = (as ?? 'div') as ElementType

  return (
    <Element
      className={cx(
        'mx-auto px-4 pt-6 pb-16 sm:px-6',
        widthClassNames[width],
        className,
      )}
      {...props}
    />
  )
}
