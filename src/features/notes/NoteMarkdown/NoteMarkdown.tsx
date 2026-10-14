import { type ComponentProps, useMemo } from 'react'

import { cx } from '@/lib/cx'

import { renderMarkdown } from '../markdown'

type NoteMarkdownProps = Omit<
  ComponentProps<'div'>,
  'children' | 'dangerouslySetInnerHTML'
> & {
  /** The note's markdown. */
  content: string
}

/** A note's markdown, rendered and styled for reading. */
export default function NoteMarkdown({
  content,
  className,
  ...props
}: NoteMarkdownProps) {
  const html = useMemo(() => renderMarkdown(content), [content])

  return (
    <div
      className={cx('markdown', className)}
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  )
}
