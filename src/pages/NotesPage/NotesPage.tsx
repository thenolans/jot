import { useEffect } from 'react'
import { Outlet } from 'react-router'

import CloseIcon from '@/components/icons/CloseIcon'
import PlusIcon from '@/components/icons/PlusIcon'
import Button from '@/components/ui/Button'
import Eyebrow from '@/components/ui/Eyebrow'
import FloatingActionLink from '@/components/ui/FloatingActionLink'
import PageContainer from '@/components/ui/PageContainer'
import PageTitle from '@/components/ui/PageTitle'
import { useFolders } from '@/features/folders/useFolders'
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

  const { folders } = useFolders()
  const folder = folders?.find(({ id }) => id === filters.folderId)

  // A folder that's gone (deleted, or from an old link) shows every note instead.
  const isFolderMissing =
    folders !== undefined && filters.folderId !== null && !folder
  const { clearFolder } = filters
  useEffect(() => {
    if (isFolderMissing) clearFolder()
  }, [isFolderMissing, clearFolder])

  const showStatus = !results.isLoading && !results.isStale && !results.error
  const scope = [
    filters.folderId === null ? 'All' : folder?.name,
    filters.query && `“${filters.query}”`,
  ].filter(Boolean)

  return (
    // Bottom spacing on wide screens clears the new-note button.
    <PageContainer width="wide" className="md:pb-24">
      <PageTitle>Notes</PageTitle>
      <h1 className="sr-only">Notes</h1>
      {/* Holds its height while loading, so the grid doesn't shift down when the count arrives. */}
      <div className="mb-4 flex min-h-8 items-center gap-4">
        {showStatus && (
          <>
            <Eyebrow as="p" className="truncate">
              {[plural(results.count, 'note', 'notes'), ...scope].join(' · ')}
            </Eyebrow>
            {/* Leaving a folder is the folder nav's job, so this only drops the search. */}
            {filters.query && (
              <Button
                variant="selected"
                size="sm"
                onClick={filters.clearQuery}
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
        folderName={folder?.name}
        page={filters.page}
        pageTo={filters.pageTo}
        noteTo={filters.noteTo}
        newNoteLink={filters.newNoteLink}
        onClearFilters={filters.clearFilters}
      />
      <FloatingActionLink
        {...filters.newNoteLink}
        icon={<PlusIcon />}
        label="New note"
      />
      <Outlet />
    </PageContainer>
  )
}
