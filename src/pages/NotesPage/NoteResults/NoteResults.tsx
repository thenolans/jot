import type { LinkProps, To } from 'react-router'

import type { NotePageState } from '@/app/paths'
import CloseIcon from '@/components/icons/CloseIcon'
import PlusIcon from '@/components/icons/PlusIcon'
import Button from '@/components/ui/Button'
import ButtonLink from '@/components/ui/ButtonLink'
import EmptyState from '@/components/ui/EmptyState'
import ErrorRetry from '@/components/ui/ErrorRetry'
import Pagination from '@/components/ui/Pagination'
import NoteCard from '@/features/notes/NoteCard'
import NoteCardSkeleton from '@/features/notes/NoteCardSkeleton'
import { notePreview, previewLines } from '@/features/notes/notePreview'
import type { Note } from '@/features/notes/types'
import type { useNotes } from '@/features/notes/useNotes'
import { cx } from '@/lib/cx'
import { plural } from '@/lib/plural'

import NoteColumns from '../NoteColumns'

type NoteResultsProps = {
  results: ReturnType<typeof useNotes>
  /** The search the notes are narrowed to, or `''`. */
  query: string
  /** Whether the notes are narrowed to a folder. */
  inFolder: boolean
  /** Whether the notes are those shared with the user. */
  shared: boolean
  /** The folder's name, once it's known. */
  folderName?: string
  /** The page shown, from 1. */
  page: number
  /** Where another page of the same results lives. */
  pageTo: (page: number) => To
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
  (note.title ? 3 : 1) + previewLines(notePreview(note.content))

/** The grid of notes, or what to show instead while it loads, fails or comes up empty. */
export default function NoteResults({
  results,
  query,
  inFolder,
  shared,
  folderName,
  page,
  pageTo,
  noteTo,
  newNoteLink,
  onClearFilters,
}: NoteResultsProps) {
  const {
    notes,
    count,
    pageCount,
    isLoading,
    isStale,
    isPageNotFound,
    error,
    reload,
  } = results
  const hasFilters = query !== '' || inFolder || shared

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
          renderItem={({ lines }) => <NoteCardSkeleton lines={lines} />}
        />
      </>
    )
  }

  if (isPageNotFound) {
    return (
      <EmptyState
        title="No notes on this page"
        action={
          <ButtonLink to={pageTo(1)} replace>
            Go to the first page
          </ButtonLink>
        }
      >
        The list is shorter than it was.
      </EmptyState>
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
    if (inFolder)
      return (
        <EmptyState
          title={folderName ? `${folderName} is empty` : 'This folder is empty'}
          action={clearFilters}
        >
          Notes you add to this folder will collect here. Notes in folders
          inside it count too.
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
      <NoteColumns
        items={notes}
        estimateHeight={estimateHeight}
        getKey={(note) => note.id}
        renderItem={(note) => (
          <NoteCard
            note={note}
            to={noteTo(note.id)}
            state={{ fromList: true } satisfies NotePageState}
            // The note opens over the grid, which stays scrolled where it was.
            preventScrollReset
          />
        )}
      />
      {pageCount > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            label="Note pages"
            page={page}
            pageCount={pageCount}
            to={pageTo}
          />
        </div>
      )}
    </div>
  )
}
