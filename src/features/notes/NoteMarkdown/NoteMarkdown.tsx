import { type ComponentProps, useMemo } from 'react'

import { cx } from '@/lib/cx'

import { renderMarkdown, renderMarkdownPreview } from '../markdown'

type NoteMarkdownProps = Omit<
  ComponentProps<'div'>,
  'children' | 'dangerouslySetInnerHTML'
> & {
  /** The note's markdown. */
  content: string
  /**
   * `preview` is for a note's card: smaller and tighter, with links, images and task boxes left as
   * text, since the card is itself a link.
   */
  variant?: 'full' | 'preview'
}

/** A note's markdown, rendered and styled for reading. */
export default function NoteMarkdown({
  content,
  variant = 'full',
  className,
  ...props
}: NoteMarkdownProps) {
  const html = useMemo(
    () =>
      variant === 'preview'
        ? renderMarkdownPreview(content)
        : renderMarkdown(content),
    [content, variant],
  )

  return (
    <div
      className={cx(
        'markdown',
        variant === 'preview' && 'markdown-preview',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  )
}
