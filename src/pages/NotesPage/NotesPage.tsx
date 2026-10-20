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
 * it (`NotePage`), keeping the grid behind as it was. Notes shared with the user have a list of their
 * own, and join the user's notes in a search of them all. The notes filed in no folder have a list of
 * their own too.
 */
export default function NotesPage() {
  const params = useNoteSearchParams()
  const { filters } = params
  const results = useNotes(filters, params.page)

  const { folders } = useFolders()
  const folder = folders?.find(({ id }) => id === filters.folderId)

  // A folder that's gone (deleted, or from an old link) shows every note instead.
  const isFolderMissing =
    folders !== undefined && filters.folderId !== null && !folder
  const { clearFolder } = params
  useEffect(() => {
    if (isFolderMissing) clearFolder()
  }, [isFolderMissing, clearFolder])

  const showStatus = !results.isLoading && !results.isStale && !results.error
  const scope = [
    filters.shared === true
      ? 'Shared with me'
      : filters.unfiled
        ? 'Unfiled'
        : filters.folderId === null
          ? 'All'
          : folder?.name,
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
              {[plural(results.count, 'note'), ...scope].join(' · ')}
            </Eyebrow>
            {/* Leaving a folder is the folder nav's job, so this only drops the search. */}
            {filters.query && (
              <Button
                variant="selected"
                size="sm"
                onClick={params.clearQuery}
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
        filters={filters}
        folderName={folder?.name}
        page={params.page}
        pageTo={params.pageTo}
        noteTo={params.noteTo}
        newNoteLink={params.newNoteLink}
        onClearFilters={params.clearFilters}
      />
      <FloatingActionLink
        {...params.newNoteLink}
        icon={<PlusIcon />}
        label="New note"
      />
      <Outlet />
    </PageContainer>
  )
}
