import { describe, expect, it } from 'vitest'

import type { Folder } from '@/features/folders/types'

import { NOTE_PAGE_SIZE } from './api'
import { notesPage } from './notesPage'
import type { Note } from './types'

const note = (id: number, changes: Partial<Note> = {}): Note => ({
  id,
  title: '',
  content: '',
  folderId: null,
  access: 'owner',
  owner: { name: 'Tom', email: 'tom@example.com' },
  shareCount: 0,
  isPinned: false,
  isChecklist: false,
  createdAt: '2026-10-01T00:00:00Z',
  updatedAt: '2026-10-01T00:00:00Z',
  ...changes,
})

// 1 holds 2; 3 is on its own.
const folders: Folder[] = [
  { id: 1, name: 'Trips', parentId: null, isPrivate: false, noteCount: 0 },
  { id: 2, name: 'Japan', parentId: 1, isPrivate: false, noteCount: 0 },
  { id: 3, name: 'Work', parentId: null, isPrivate: false, noteCount: 0 },
]

const ids = (page: ReturnType<typeof notesPage>) =>
  page?.results.map(({ id }) => id)

describe('notesPage', () => {
  it('sorts by last edited, then newest first', () => {
    const notes = [
      note(1, { updatedAt: '2026-10-02T00:00:00Z' }),
      note(2, { updatedAt: '2026-10-03T00:00:00.000Z' }),
      note(3, { updatedAt: '2026-10-02T00:00:00Z' }),
    ]
    expect(ids(notesPage(notes, folders, {}, 1))).toEqual([2, 3, 1])
  })

  it('puts pinned notes first, except in a search', () => {
    const notes = [
      note(1, { updatedAt: '2026-10-03T00:00:00Z', title: 'Gate' }),
      note(2, { updatedAt: '2026-10-01T00:00:00Z', isPinned: true }),
      note(3, {
        updatedAt: '2026-10-02T00:00:00Z',
        isPinned: true,
        title: 'Gate',
      }),
    ]
    expect(ids(notesPage(notes, folders, {}, 1))).toEqual([3, 2, 1])
    expect(ids(notesPage(notes, folders, { query: 'gate' }, 1))).toEqual([1, 3])
  })

  it('matches the search in titles and text, ignoring case', () => {
    const notes = [
      note(1, { title: 'Ramen spots' }),
      note(2, { content: 'Best RAMEN in town' }),
      note(3, { title: 'Sushi' }),
    ]
    const page = notesPage(notes, folders, { query: ' ramen ' }, 1)
    expect(ids(page)).toEqual([2, 1])
    expect(page?.count).toBe(2)
  })

  it('narrows to notes shared with the user, or to their own', () => {
    const sharer = { name: 'Sarah', email: 'sarah@example.com' }
    const notes = [
      note(1),
      note(2, { access: 'view', owner: sharer }),
      note(3, { access: 'edit', owner: sharer }),
    ]
    expect(ids(notesPage(notes, folders, { shared: true }, 1))).toEqual([3, 2])
    expect(ids(notesPage(notes, folders, { shared: false }, 1))).toEqual([1])
    expect(ids(notesPage(notes, folders, { shared: null }, 1))).toEqual([
      3, 2, 1,
    ])
  })

  it('narrows to the notes filed directly in the folder', () => {
    const notes = [
      note(1, { folderId: 1 }),
      note(2, { folderId: 2 }),
      note(3, { folderId: 3 }),
      note(4),
    ]
    expect(ids(notesPage(notes, folders, { folderId: 1 }, 1))).toEqual([1])
    expect(ids(notesPage(notes, folders, { folderId: 2 }, 1))).toEqual([2])
  })

  it("narrows to the user's own notes in no folder", () => {
    const sharer = { name: 'Sarah', email: 'sarah@example.com' }
    const notes = [
      note(1, { folderId: 1 }),
      note(2, { title: 'Packing' }),
      note(3),
      note(4, { access: 'view', owner: sharer }),
    ]
    expect(ids(notesPage(notes, folders, { unfiled: true }, 1))).toEqual([3, 2])
    expect(
      ids(notesPage(notes, folders, { unfiled: true, query: 'packing' }, 1)),
    ).toEqual([2])
  })

  it('leaves notes in private folders out of every note and its search, not the folder', () => {
    const marked = folders.map((each) =>
      each.id === 1 ? { ...each, isPrivate: true } : each,
    )
    const notes = [
      note(1, { folderId: 1, title: 'Ramen' }),
      note(2, { folderId: 2, title: 'Ramen' }),
      note(3, { folderId: 3, title: 'Ramen' }),
      note(4, { title: 'Ramen' }),
    ]
    expect(ids(notesPage(notes, marked, {}, 1))).toEqual([4, 3])
    expect(ids(notesPage(notes, marked, { query: 'ramen' }, 1))).toEqual([4, 3])
    expect(ids(notesPage(notes, marked, { folderId: 1 }, 1))).toEqual([1])
    expect(ids(notesPage(notes, marked, { folderId: 2 }, 1))).toEqual([2])
  })

  it('pages the results, and has nothing past the last page', () => {
    const notes = Array.from({ length: NOTE_PAGE_SIZE + 1 }, (_, index) =>
      note(index + 1),
    )
    expect(notesPage(notes, folders, {}, 1)?.results).toHaveLength(
      NOTE_PAGE_SIZE,
    )
    expect(ids(notesPage(notes, folders, {}, 2))).toEqual([1])
    expect(notesPage(notes, folders, {}, 3)).toBeNull()
    expect(notesPage([], folders, {}, 1)?.count).toBe(0)
  })
})
