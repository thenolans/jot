import { cx } from '@/lib/cx'

import type { useNotes } from '../../useNotes'

type SearchStatusProps = {
  results: ReturnType<typeof useNotes>
  /** The search the results are for. */
  query: string
  /** The search came back with no notes to suggest. */
  isEmpty: boolean
}

/** Explains why there are no notes to suggest, and announces it to screen readers. */
export default function SearchStatus({
  results,
  query,
  isEmpty,
}: SearchStatusProps) {
  let message: string | null = null
  if (results.error) message = results.error
  else if (results.isLoading) message = 'Searching…'
  else if (isEmpty)
    message = query ? `No notes match “${query}”` : 'No notes yet'

  return (
    <p
      role="status"
      className={cx('px-2 text-center text-base text-muted', message && 'py-6')}
    >
      {message}
    </p>
  )
}
