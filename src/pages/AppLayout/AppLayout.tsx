import { useState } from 'react'
import { Outlet, type To, useSearchParams } from 'react-router'

import { folderIdParam, paths } from '@/app/paths'
import FolderNav from '@/features/folders/FolderNav'
import { useNoteCount } from '@/features/notes/useNoteCount'

import AppBar from './AppBar'
import FolderSheet from './FolderSheet'
import TabBar from './TabBar'

/**
 * Frame for the signed-in app: the app bar on top and the folders beside the page, down the side on wide
 * screens, or on narrow ones in a sheet opened from the tab bar at the bottom.
 */
export default function AppLayout() {
  const [searchParams] = useSearchParams()
  const activeFolderId = folderIdParam(searchParams)
  const noteCount = useNoteCount()
  const [isSheetOpen, setSheetOpen] = useState(false)

  // A folder's notes, keeping the search shown, from the first page.
  const folderTo = (id: number | null): To => {
    const next = new URLSearchParams(searchParams)
    next.delete('page')
    if (id === null) next.delete('folder')
    else next.set('folder', String(id))
    return { pathname: paths.notes, search: next.toString() }
  }

  return (
    <div className="min-h-screen pb-(--tab-bar-height) md:pb-0">
      <AppBar />
      {/* The page clears the sidebar by its width. */}
      <aside className="fixed top-(--top-bar-height) bottom-0 left-0 z-10 hidden w-60 overflow-y-auto border-r border-border bg-surface px-2 py-4 md:block print:hidden">
        <FolderNav
          variant="sidebar"
          activeFolderId={activeFolderId}
          folderTo={folderTo}
          noteCount={noteCount}
        />
      </aside>
      <main className="md:pl-60">
        <Outlet />
      </main>
      <TabBar
        isAllNotes={activeFolderId === null}
        isFoldersActive={isSheetOpen || activeFolderId !== null}
        onOpenFolders={() => setSheetOpen(true)}
      />
      {isSheetOpen && (
        <FolderSheet
          activeFolderId={activeFolderId}
          folderTo={folderTo}
          noteCount={noteCount}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  )
}
