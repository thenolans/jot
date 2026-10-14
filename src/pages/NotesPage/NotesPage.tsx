import { Outlet } from 'react-router'

import CloseIcon from '@/components/icons/CloseIcon'
import Button from '@/components/ui/Button'
import Eyebrow from '@/components/ui/Eyebrow'
import PageContainer from '@/components/ui/PageContainer'
import PageTitle from '@/components/ui/PageTitle'
import { useNotes } from '@/features/notes/useNotes'
import { plural } from '@/lib/plural'

import NoteResults from './NoteResults'
import { useNoteSearchParams } from './useNoteSearchParams'

/**
 * Where signing in lands: the grid of the user's notes, most recently edited first. A note opens over
 * it (`NotePage`), keeping the grid behind as it was.
 */
export default function NotesPage() {
  const filters = useNoteSearchParams()
  const results = useNotes(
    { query: filters.query, folderId: filters.folderId },
    filters.page,
  )

  const showStatus = !results.isLoading && !results.isStale && !results.error
  const scope = [
    filters.folderId === null && 'All',
    filters.query && `“${filters.query}”`,
  ].filter(Boolean)

  return (
    <PageContainer width="wide">
      <PageTitle>Notes</PageTitle>
      <h1 className="sr-only">Notes</h1>
      {/* Holds its height while loading, so the grid doesn't shift down when the count arrives. */}
      <div className="mb-4 flex min-h-8 items-center gap-4">
        {showStatus && (
          <>
            <Eyebrow as="p" className="truncate">
              {[plural(results.count, 'note', 'notes'), ...scope].join(' · ')}
            </Eyebrow>
            {filters.hasFilters && (
              <Button
                variant="selected"
                size="sm"
                onClick={filters.clearFilters}
                className="flex-none"
              >
                Clear
                <CloseIcon />
              </Button>
            )}
          </>
        )}
      </div>

      <NoteResults
        results={results}
        query={filters.query}
        inFolder={filters.folderId !== null}
        page={filters.page}
        pageTo={filters.pageTo}
        noteTo={filters.noteTo}
        onClearFilters={filters.clearFilters}
      />
      <Outlet />
    </PageContainer>
  )
}
