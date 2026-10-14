import { type ReactNode, useContext } from 'react'
import {
  AutocompleteStateContext,
  Header,
  ListBox,
  ListBoxItem,
  ListBoxSection,
} from 'react-aria-components'

import FolderIcon from '@/components/icons/FolderIcon'
import NotesIcon from '@/components/icons/NotesIcon'
import PlusIcon from '@/components/icons/PlusIcon'
import Eyebrow from '@/components/ui/Eyebrow'
import type { Folder } from '@/features/folders/types'
import { cx } from '@/lib/cx'
import { plural } from '@/lib/plural'

import { notePreview } from '../../notePreview'
import type { Note } from '../../types'

/** What picking an option does. */
export type SearchAction =
  | { type: 'note'; id: number }
  | { type: 'folder'; id: number }
  /** Show every note matching the search. */
  | { type: 'all' }
  /** Start a note titled with the search. */
  | { type: 'new' }

/** An option's key in the list box, which takes strings or numbers. */
const keyOf = (action: SearchAction) =>
  'id' in action ? `${action.type}:${action.id}` : action.type

function actionOf(key: string): SearchAction {
  const [type, id] = key.split(':')
  if (type === 'note' || type === 'folder') return { type, id: Number(id) }
  return { type: type as 'all' | 'new' }
}

type SearchResultsProps = {
  notes: Note[]
  /** Where a suggested note is filed, to show under its name. */
  noteFolderLabel: (note: Note) => string
  folders: Folder[]
  query: string
  /** How many notes match in all, or `null` until the results catch up with the typing. */
  count: number | null
  /** The notes match what's typed. Until they do, they can't be picked. */
  isSettled: boolean
  /** The option Enter picks when none is highlighted, marked so the user knows. */
  defaultAction: SearchAction | null
  onAction: (action: SearchAction) => void
}

const option =
  'flex cursor-pointer items-center gap-2 rounded-sm p-2 outline-none data-focused:bg-accent-soft data-hovered:bg-accent-soft'

const sectionHeader = (label: string) => (
  <Header className="px-2 pt-2 pb-1">
    <Eyebrow>{label}</Eyebrow>
  </Header>
)

/** A note's title, or the first line of its text when it has none. */
const noteName = (note: Note) =>
  note.title || notePreview(note.content).split('\n')[0] || 'Empty note'

/**
 * The suggested notes and folders, then "See all" and "New note" once something's typed. Options are
 * highlighted with the arrow keys while focus stays in the search box. Must be inside an `Autocomplete`.
 */
export default function SearchResults({
  notes,
  noteFolderLabel,
  folders,
  query,
  count,
  isSettled,
  defaultAction,
  onAction,
}: SearchResultsProps) {
  const isHighlighting =
    useContext(AutocompleteStateContext)?.focusedNodeId != null
  const defaultKey = defaultAction && keyOf(defaultAction)
  // No point offering every match when the search has come back with none.
  const showSeeAll = query !== '' && count !== 0
  const countLabel = count === null ? 'notes' : plural(count, 'note')

  const enterHint = (key: string, isFocused: boolean) =>
    (isFocused || (!isHighlighting && key === defaultKey)) && (
      <span
        aria-hidden="true"
        className="ml-auto flex-none text-xs text-accent"
      >
        ↵
      </span>
    )

  const item = (
    action: SearchAction,
    textValue: string,
    className: string,
    content: ReactNode,
  ) => {
    const key = keyOf(action)
    return (
      <ListBoxItem
        key={key}
        id={key}
        textValue={textValue}
        className={className}
      >
        {({ isFocused }) => (
          <>
            {content}
            {enterHint(key, isFocused)}
          </>
        )}
      </ListBoxItem>
    )
  }

  return (
    <ListBox
      aria-label="Search results"
      aria-busy={!isSettled}
      onAction={(key) => onAction(actionOf(String(key)))}
      disabledKeys={
        isSettled ? [] : notes.map(({ id }) => keyOf({ type: 'note', id }))
      }
      className={cx(
        'transition-opacity outline-none',
        !isSettled && notes.length > 0 && '[&_[data-disabled]]:opacity-60',
      )}
    >
      {notes.length > 0 && (
        <ListBoxSection>
          {sectionHeader(query ? 'Notes' : 'Recent notes')}
          {notes.map((note) =>
            item(
              { type: 'note', id: note.id },
              noteName(note),
              cx(option, 'data-disabled:cursor-default'),
              <>
                <NotesIcon size={16} className="flex-none text-faint" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-medium text-ink">
                    {noteName(note)}
                  </p>
                  <p className="min-h-4 truncate text-xs text-faint">
                    {noteFolderLabel(note)}
                  </p>
                </div>
              </>,
            ),
          )}
        </ListBoxSection>
      )}
      {folders.length > 0 && (
        <ListBoxSection>
          {sectionHeader('Folders')}
          {folders.map((folder) =>
            item(
              { type: 'folder', id: folder.id },
              folder.name,
              option,
              <>
                <FolderIcon size={16} className="flex-none text-accent-mid" />
                <p className="min-w-0 truncate text-base font-medium text-ink">
                  {folder.name}
                  <span className="ml-2 text-xs font-normal text-faint">
                    {plural(folder.noteCount, 'note')}
                  </span>
                </p>
              </>,
            ),
          )}
        </ListBoxSection>
      )}
      {query && (
        <ListBoxSection
          aria-label="Actions"
          className={cx(
            (notes.length > 0 || folders.length > 0) &&
              'mt-2 border-t border-border-soft pt-2',
          )}
        >
          {showSeeAll &&
            item(
              { type: 'all' },
              `See all ${countLabel} for ${query}`,
              cx(option, 'text-base font-semibold text-accent'),
              <span className="min-w-0 truncate">
                See all {countLabel} for “{query}”
              </span>,
            )}
          {item(
            { type: 'new' },
            `New note ${query}`,
            cx(option, 'text-base font-semibold text-accent'),
            <>
              <PlusIcon className="flex-none" />
              <span className="min-w-0 truncate">New note “{query}”</span>
            </>,
          )}
        </ListBoxSection>
      )}
    </ListBox>
  )
}
