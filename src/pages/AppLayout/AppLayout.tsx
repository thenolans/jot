import { useState } from 'react'
import {
  Outlet,
  type To,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router'

import {
  folderIdParam,
  folderNotesPath,
  type NotePageState,
  notePath,
  noteSearchPath,
  paths,
  sharedParam,
  unfiledParam,
} from '@/app/paths'
import FolderNav from '@/features/folders/FolderNav'
import NoteSearchDialog, {
  type SearchAction,
} from '@/features/notes/NoteSearchDialog'
import { useKeepNotesOffline } from '@/features/notes/useKeepNotesOffline'
import { useNoteCount } from '@/features/notes/useNoteCount'

import AppBar from './AppBar'
import FolderSheet from './FolderSheet'
import TabBar from './TabBar'
import { useSavedFolderParam } from './useSavedFolderParam'
import { useSearchShortcut } from './useSearchShortcut'

/**
 * Frame for the signed-in app: the app bar on top and the folders beside the page, down the side on wide
 * screens, or on narrow ones in a sheet opened from the tab bar at the bottom. The app bar or tab bar
 * opens search, as does ⌘K. While it's open, every note is kept on the device, for use offline.
 */
export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const activeFolderId = folderIdParam(searchParams)
  const isUnfiledActive = unfiledParam(searchParams)
  const isSharedActive = sharedParam(searchParams)
  const noteCount = useNoteCount({ shared: false })
  const unfiledCount = useNoteCount({ unfiled: true })
  const sharedCount = useNoteCount({ shared: true })
  useKeepNotesOffline()
  useSavedFolderParam()
  const [isSheetOpen, setSheetOpen] = useState(false)
  const [isSearchOpen, setSearchOpen] = useState(false)

  const openSearch = () => setSearchOpen(true)
  useSearchShortcut(openSearch)

  // A folder's notes, the unfiled ones or those shared with the user, keeping the search shown, from the first page.
  const notesTo = (changes: {
    folder?: number
    unfiled?: boolean
    shared?: boolean
  }): To => {
    const next = new URLSearchParams(searchParams)
    next.delete('page')
    next.delete('folder')
    next.delete('unfiled')
    next.delete('shared')
    if (changes.folder !== undefined) next.set('folder', String(changes.folder))
    if (changes.unfiled) next.set('unfiled', '1')
    if (changes.shared) next.set('shared', '1')
    return { pathname: paths.notes, search: next.toString() }
  }
  const navProps = {
    activeFolderId,
    folderTo: (id: number | null) => notesTo({ folder: id ?? undefined }),
    noteCount,
    isUnfiledActive,
    unfiledTo: notesTo({ unfiled: true }),
    unfiledCount,
    isSharedActive,
    sharedTo: notesTo({ shared: true }),
    sharedCount,
  }

  // A note opens over the grid as it is. In place of a note that's already open, it closes the way that
  // one would have.
  const openOverGrid = (pathname: string, state: NotePageState) => {
    const isNoteOpen = location.pathname !== paths.notes
    const openState = location.state as NotePageState | null
    navigate(
      { pathname, search: location.search },
      {
        state: {
          ...state,
          fromList: isNoteOpen ? openState?.fromList : true,
        } satisfies NotePageState,
        replace: isNoteOpen,
        preventScrollReset: true,
      },
    )
  }

  const handleSearchAction = (action: SearchAction, query: string) => {
    if (action.type === 'note') openOverGrid(notePath(action.id), {})
    else if (action.type === 'new')
      openOverGrid(paths.newNote, { folderId: activeFolderId, title: query })
    else if (action.type === 'folder') navigate(folderNotesPath(action.id))
    else navigate(noteSearchPath(query))
  }

  return (
    <div className="min-h-screen pb-(--tab-bar-height) md:pb-0">
      <AppBar searchQuery={searchParams.get('q') ?? ''} onSearch={openSearch} />
      {/* The page clears the sidebar by its width. */}
      <aside className="fixed top-(--top-bar-height) bottom-0 left-0 z-10 hidden w-60 overflow-y-auto border-r border-border bg-surface px-2 py-4 md:block print:hidden">
        <FolderNav variant="sidebar" {...navProps} />
      </aside>
      <main className="md:pl-60">
        <Outlet />
      </main>
      <TabBar
        isAllNotes={
          activeFolderId === null && !isUnfiledActive && !isSharedActive
        }
        isFoldersActive={
          isSheetOpen ||
          activeFolderId !== null ||
          isUnfiledActive ||
          isSharedActive
        }
        onOpenFolders={() => setSheetOpen(true)}
        onSearch={openSearch}
      />
      {isSheetOpen && (
        <FolderSheet {...navProps} onClose={() => setSheetOpen(false)} />
      )}
      {isSearchOpen && (
        <NoteSearchDialog
          // Refine the search the grid is showing.
          initialQuery={searchParams.get('q') ?? ''}
          onClose={() => setSearchOpen(false)}
          onAction={handleSearchAction}
        />
      )}
    </div>
  )
}
