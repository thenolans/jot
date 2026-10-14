import { type KeyboardEvent, useEffect, useRef, useState } from 'react'
import { Autocomplete, Input, TextField } from 'react-aria-components'

import CloseIcon from '@/components/icons/CloseIcon'
import SearchIcon from '@/components/icons/SearchIcon'
import IconButton from '@/components/ui/IconButton'
import ModalShell, { closeModal } from '@/components/ui/ModalShell'
import { folderPath } from '@/features/folders/folderTree'
import { useFolders } from '@/features/folders/useFolders'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

import { useNotes } from '../useNotes'
import SearchResults, { type SearchAction } from './SearchResults'
import SearchStatus from './SearchStatus'

type NoteSearchDialogProps = {
  /** Search text to start with, such as the search already applied to the notes grid. */
  initialQuery?: string
  onClose: () => void
  /** Called with what was picked: a note or folder to open, every match to show, or a note to start. */
  onAction: (action: SearchAction, query: string) => void
}

const NOTE_LIMIT = 5
const FOLDER_LIMIT = 4

/** How long typing pauses before the search runs. */
const SEARCH_DELAY_MS = 250

/**
 * A modal search box that suggests notes and folders as you type: the latest notes until then. Pick one,
 * see every matching note, or start a note with what's typed. Render it to open it; it calls `onClose`
 * when it should be removed.
 */
export default function NoteSearchDialog({
  initialQuery = '',
  onClose,
  onAction,
}: NoteSearchDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [text, setText] = useState(initialQuery)
  const query = text.trim()
  const searchedQuery = useDebouncedValue(query, SEARCH_DELAY_MS)
  const results = useNotes({ query: searchedQuery })
  const notes = results.notes.slice(0, NOTE_LIMIT)
  // The suggestions match what's typed, so picking one does what it shows.
  const isSettled =
    searchedQuery === query &&
    !results.isLoading &&
    !results.isStale &&
    !results.error

  // Folders are all loaded already, so they're matched here, as the user types.
  const { folders = [] } = useFolders()
  const lowerQuery = query.toLowerCase()
  const matchingFolders = query
    ? folders
        .filter(({ name }) => name.toLowerCase().includes(lowerQuery))
        .slice(0, FOLDER_LIMIT)
    : []

  /** What Enter does when no option is highlighted: open the top note, or search for what's typed. */
  const defaultAction: SearchAction | null =
    isSettled && notes.length > 0
      ? { type: 'note', id: notes[0].id }
      : query && !(isSettled && results.count === 0)
        ? { type: 'all' }
        : null

  const close = () => closeModal(dialogRef.current)
  const choose = (action: SearchAction) => {
    onAction(action, query)
    close()
  }

  // Runs after ModalShell has opened the dialog.
  useEffect(() => {
    inputRef.current?.select()
  }, [])

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // A highlighted option handles Enter itself.
    if (
      event.key !== 'Enter' ||
      event.nativeEvent.isComposing ||
      event.currentTarget.getAttribute('aria-activedescendant')
    )
      return
    event.preventDefault()
    if (defaultAction) choose(defaultAction)
  }

  return (
    <ModalShell
      dialogRef={dialogRef}
      aria-label="Search notes"
      onClose={onClose}
      // The panel shrinks to fit above the on-screen keyboard, and its results scroll.
      className="flex flex-col px-4 pb-4"
      panelClassName="mx-auto mt-(--top-bar-offset) flex min-h-0 w-full max-w-xl flex-col overflow-hidden border border-border"
    >
      {/* Notes are filtered by the API, so the autocomplete only handles the keyboard and focus. */}
      <Autocomplete
        inputValue={text}
        onInputChange={setText}
        disableAutoFocusFirst
      >
        <div className="flex items-center gap-2 border-b border-border-soft p-4">
          <SearchIcon size={16} className="flex-none text-accent" />
          <TextField aria-label="Search notes" className="min-w-0 flex-1">
            <Input
              ref={inputRef}
              enterKeyHint="search"
              autoComplete="off"
              spellCheck={false}
              placeholder="Search notes and folders…"
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-base text-ink placeholder:text-faint focus-visible:shadow-none"
            />
          </TextField>
          <IconButton size="sm" onClick={close} aria-label="Close search">
            <CloseIcon size={16} />
          </IconButton>
        </div>

        <div className="max-h-96 min-h-0 overflow-y-auto p-2">
          <SearchStatus
            results={results}
            query={searchedQuery}
            isEmpty={isSettled && notes.length === 0}
          />
          <SearchResults
            notes={notes}
            // Blank until the folders load.
            noteFolderLabel={(note) =>
              note.folderId === null
                ? 'No folder'
                : folderPath(folders, note.folderId).join(' / ')
            }
            folders={matchingFolders}
            query={query}
            count={isSettled ? results.count : null}
            isSettled={isSettled}
            defaultAction={defaultAction}
            onAction={choose}
          />
        </div>
      </Autocomplete>
    </ModalShell>
  )
}
