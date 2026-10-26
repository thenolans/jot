import { useId } from 'react'
import type { LinkProps, To } from 'react-router'

import type { NotePageState } from '@/app/paths'
import CloseIcon from '@/components/icons/CloseIcon'
import PlusIcon from '@/components/icons/PlusIcon'
import Button from '@/components/ui/Button'
import ButtonLink from '@/components/ui/ButtonLink'
import EmptyState from '@/components/ui/EmptyState'
import ErrorRetry from '@/components/ui/ErrorRetry'
import Eyebrow from '@/components/ui/Eyebrow'
import NoteCard from '@/features/notes/NoteCard'
import NoteCardSkeleton from '@/features/notes/NoteCardSkeleton'
import { notePreview, previewLines } from '@/features/notes/notePreview'
import type { Note, NoteFilters } from '@/features/notes/types'
import { useNoteLayout } from '@/features/notes/useNoteLayout'
import type { useNotes } from '@/features/notes/useNotes'
import { cx } from '@/lib/cx'
import { plural } from '@/lib/plural'

import NoteColumns from '../NoteColumns'
import { useLoadMoreSentinel } from './useLoadMoreSentinel'

type NoteResultsProps = {
  results: ReturnType<typeof useNotes>
  /** What the notes are narrowed to. */
  filters: Required<NoteFilters>
  /** The folder's name, once it's known. */
  folderName?: string
  /** Where a note opens. */
  noteTo: (id: number) => To
  /** Link props for a new note. */
  newNoteLink: Omit<LinkProps, 'children'>
  onClearFilters: () => void
}

// Preview lines for the skeleton cards, varied like a real grid of notes.
const SKELETON_LINES = [5, 3, 9, 3, 7, 5, 3, 7, 5]

// A card's padding takes about as much room as a line of preview, and its title two more.
const estimateHeight = (note: Note) =>
  (note.title ? 3 : 1) + previewLines(notePreview(note.content), note.id)

/**
 * The grid of notes, or what to show instead while it loads, fails or comes up empty. More load as it's
 * scrolled to the end. Pinned notes come first from the API, and get a section of their own above the
 * rest; a search lists them in with the others, by when they were edited.
 */
export default function NoteResults({
  results,
  filters,
  folderName,
  noteTo,
  newNoteLink,
  onClearFilters,
}: NoteResultsProps) {
  const {
    notes,
    count,
    isLoading,
    isStale,
    hasMore,
    isLoadingMore,
    loadMoreError,
    loadMore,
    error,
    reload,
  } = results
  const [layout] = useNoteLayout()
  const compact = layout === 'compact'
  const pinnedId = useId()
  const othersId = useId()
  const { query, folderId, unfiled } = filters
  const shared = filters.shared === true
  const hasFilters = query !== '' || folderId !== null || unfiled || shared
  const sentinelRef = useLoadMoreSentinel(
    loadMore,
    hasMore && !loadMoreError,
    notes.length,
  )

  if (isLoading) {
    return (
      <>
        <p role="status" className="sr-only">
          Loading notes
        </p>
        <NoteColumns
          items={SKELETON_LINES.map((lines, index) => ({ lines, index }))}
          estimateHeight={({ lines }) => 3 + lines}
          getKey={({ index }) => index}
          renderItem={({ lines }) => (
            <NoteCardSkeleton lines={lines} compact={compact} />
          )}
          compact={compact}
        />
      </>
    )
  }

  if (error) {
    return (
      <ErrorRetry onRetry={reload} className={cx(isStale && 'opacity-60')}>
        {error}
      </ErrorRetry>
    )
  }

  if (notes.length === 0) {
    const clearFilters = (
      <Button variant="secondary" onClick={onClearFilters}>
        <CloseIcon />
        Clear filters
      </Button>
    )
    if (query)
      return (
        <EmptyState title="Nothing matches that — yet" action={clearFilters}>
          No notes mention “{query}”. Try another search, or clear it.
        </EmptyState>
      )
    if (shared)
      return (
        <EmptyState title="Nothing shared with you yet">
          Notes other people share with you will show up here.
        </EmptyState>
      )
    if (unfiled)
      return (
        <EmptyState title="Everything's filed" action={clearFilters}>
          Notes you keep out of folders will collect here.
        </EmptyState>
      )
    if (folderId !== null)
      return (
        <EmptyState
          title={folderName ? `${folderName} is empty` : 'This folder is empty'}
          action={clearFilters}
        >
          Notes you add to this folder will collect here.
        </EmptyState>
      )
    return (
      <EmptyState
        title="Your first jot awaits"
        action={
          <ButtonLink {...newNoteLink}>
            <PlusIcon />
            Write your first note
          </ButtonLink>
        }
      >
        Notes you write show up here, sorted by last edited. Folders keep
        everything tidy.
      </EmptyState>
    )
  }

  const noteColumns = (notes: Note[]) => (
    <NoteColumns
      items={notes}
      estimateHeight={estimateHeight}
      getKey={(note) => note.id}
      compact={compact}
      renderItem={(note) => (
        <NoteCard
          note={note}
          compact={compact}
          to={noteTo(note.id)}
          state={{ fromList: true } satisfies NotePageState}
          // The note opens over the grid, which stays scrolled where it was.
          preventScrollReset
        />
      )}
    />
  )
  const pinned = query ? [] : notes.filter((note) => note.isPinned)
  const others = query ? notes : notes.filter((note) => !note.isPinned)

  return (
    <div
      aria-busy={isStale}
      className={cx('transition-opacity', isStale && 'opacity-60')}
    >
      {hasFilters && (
        <p role="status" className="sr-only">
          {plural(count, 'note matches', 'notes match')}
        </p>
      )}
      {pinned.length > 0 ? (
        <>
          <section aria-labelledby={pinnedId} className="flex flex-col gap-4">
            <Eyebrow as="h2" id={pinnedId}>
              Pinned
            </Eyebrow>
            {noteColumns(pinned)}
          </section>
          {others.length > 0 && (
            <section
              aria-labelledby={othersId}
              className="mt-8 flex flex-col gap-4"
            >
              <Eyebrow as="h2" id={othersId}>
                Others
              </Eyebrow>
              {noteColumns(others)}
            </section>
          )}
        </>
      ) : (
        noteColumns(others)
      )}
      {hasMore && (
        <div ref={sentinelRef} className="mt-8 flex justify-center">
          {loadMoreError ? (
            <ErrorRetry onRetry={loadMore}>{loadMoreError}</ErrorRetry>
          ) : (
            isLoadingMore && (
              <p role="status" className="text-sm text-muted">
                Loading more notes…
              </p>
            )
          )}
        </div>
      )}
    </div>
  )
}
