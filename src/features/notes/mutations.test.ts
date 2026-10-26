import { MutationObserver, QueryClient } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/lib/api'

import { createNote, fetchNote, updateNote } from './api'
import {
  setNoteMutationDefaults,
  type UpdateNote,
  updateNoteMutationKey,
} from './mutations'
import type { Note } from './types'

vi.mock('./api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./api')>()),
  createNote: vi.fn(),
  fetchNote: vi.fn(),
  updateNote: vi.fn(),
}))

const note = (changes: Partial<Note>): Note => ({
  id: 1,
  title: 'Groceries',
  content: '',
  folderId: null,
  access: 'owner',
  owner: { name: 'Tom', email: 'tom@example.com' },
  shareCount: 0,
  isPinned: false,
  isChecklist: false,
  revision: 0,
  createdAt: '2026-10-01T00:00:00Z',
  updatedAt: '2026-10-01T00:00:00Z',
  ...changes,
})

const editedElsewhere = new ApiError(409, 'Edited elsewhere.')

const base = 'Eggs\nLemons\nFlour'

let queryClient: QueryClient

beforeEach(() => {
  vi.resetAllMocks()
  queryClient = new QueryClient()
  setNoteMutationDefaults(queryClient)
})

const save = (variables: UpdateNote) =>
  new MutationObserver<Note, Error, UpdateNote>(queryClient, {
    mutationKey: updateNoteMutationKey,
  }).mutate(variables)

describe('saving a note', () => {
  it('sends the revision it was made to', async () => {
    const saved = note({ id: 1, content: 'Eggs', revision: 4 })
    vi.mocked(updateNote).mockResolvedValue(saved)

    await expect(
      save({
        id: 1,
        changes: { content: 'Eggs' },
        base: {
          title: 'Groceries',
          content: '',
          isChecklist: false,
          revision: 3,
        },
      }),
    ).resolves.toBe(saved)
    expect(updateNote).toHaveBeenCalledWith(1, { content: 'Eggs' }, 3)
  })

  it('bases the next save on the revision the last one made', async () => {
    vi.mocked(updateNote).mockResolvedValueOnce(note({ id: 2, revision: 4 }))
    vi.mocked(updateNote).mockResolvedValueOnce(note({ id: 2, revision: 5 }))
    const text = { title: 'Groceries', isChecklist: false }

    await save({
      id: 2,
      changes: { content: 'Eggs' },
      base: { ...text, content: '', revision: 3 },
    })
    await save({
      id: 2,
      changes: { content: 'Eggs\nLemons' },
      base: { ...text, content: 'Eggs', revision: 3 },
    })
    expect(updateNote).toHaveBeenLastCalledWith(
      2,
      { content: 'Eggs\nLemons' },
      4,
    )
  })

  it('merges with edits made elsewhere since', async () => {
    const theirs = note({ id: 3, content: `${base}\nMilk`, revision: 4 })
    const merged = note({ id: 3, content: `Eggs\nLemons x2\nFlour\nMilk` })
    vi.mocked(updateNote).mockRejectedValueOnce(editedElsewhere)
    vi.mocked(updateNote).mockResolvedValueOnce(merged)
    vi.mocked(fetchNote).mockResolvedValue(theirs)

    await expect(
      save({
        id: 3,
        changes: { content: 'Eggs\nLemons x2\nFlour' },
        base: {
          title: 'Groceries',
          content: base,
          isChecklist: false,
          revision: 3,
        },
      }),
    ).resolves.toBe(merged)
    expect(updateNote).toHaveBeenLastCalledWith(
      3,
      { content: 'Eggs\nLemons x2\nFlour\nMilk' },
      4,
    )
  })

  it("saves a copy when the edits can't be merged, and later edits to it", async () => {
    const theirs = note({ id: 4, content: 'Eggs\nLimes\nFlour', revision: 4 })
    const copy = note({ id: 5, title: 'Groceries (conflicted copy)' })
    vi.mocked(updateNote).mockRejectedValueOnce(editedElsewhere)
    vi.mocked(fetchNote).mockResolvedValue(theirs)
    vi.mocked(createNote).mockResolvedValue(copy)
    const text = { title: 'Groceries', isChecklist: false }

    await expect(
      save({
        id: 4,
        changes: { content: 'Eggs\nLemons x2\nFlour' },
        base: { ...text, content: base, revision: 3 },
      }),
    ).resolves.toBe(copy)
    expect(createNote).toHaveBeenCalledWith({
      ...text,
      title: 'Groceries (conflicted copy)',
      content: 'Eggs\nLemons x2\nFlour',
      folderId: null,
    })

    vi.mocked(updateNote).mockResolvedValue(copy)
    await save({
      id: 4,
      changes: { content: 'Eggs\nLemons x3\nFlour' },
      base: { ...text, content: 'Eggs\nLemons x2\nFlour', revision: 3 },
    })
    expect(updateNote).toHaveBeenLastCalledWith(5, {
      content: 'Eggs\nLemons x3\nFlour',
    })
  })
})
