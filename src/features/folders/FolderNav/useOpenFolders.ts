import { useState } from 'react'

import { resolveId } from '@/lib/localIds'

import { ancestorIds } from '../folderTree'
import type { Folder } from '../types'

const STORAGE_KEY = 'jot.openFolders'

function readStored(): number[] {
  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? '[]',
    )
    // A folder made offline is stored by its local id; by now it may have been saved.
    return Array.isArray(stored)
      ? stored.filter(Number.isInteger).map(resolveId)
      : []
  } catch {
    return []
  }
}

function store(ids: Set<number>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
  } catch {
    // Storage unavailable (e.g. private mode): they're open until reload.
  }
}

/**
 * Which folders show the folders inside them, remembered on the device. The folders around the one being
 * shown open as it's picked, so it's in view.
 */
export function useOpenFolders(
  folders: Folder[] | undefined,
  activeFolderId: number | null,
) {
  const [openIds, setOpenIds] = useState(() => new Set(readStored()))
  const [revealed, setRevealed] = useState<number | null>(null)

  const update = (change: (ids: Set<number>) => void) =>
    setOpenIds((current) => {
      const next = new Set(current)
      change(next)
      store(next)
      return next
    })

  // Opens the active folder's parents once the folders have loaded, then again whenever another is picked.
  const toReveal = folders ? activeFolderId : null
  if (folders && toReveal !== revealed) {
    setRevealed(toReveal)
    const ancestors = toReveal === null ? [] : ancestorIds(folders, toReveal)
    if (ancestors.some((id) => !openIds.has(id)))
      update((ids) => ancestors.forEach((id) => ids.add(id)))
  }

  return {
    // A folder made offline and opened by its local id stays open once it's saved.
    isOpen: (id: number) =>
      openIds.has(id) ||
      [...openIds].some((openId) => resolveId(openId) === id),
    toggle: (id: number) =>
      update((ids) => {
        if (!ids.delete(id)) ids.add(id)
      }),
    open: (id: number) => update((ids) => ids.add(id)),
  }
}
