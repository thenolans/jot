export type NoteLayout = 'full' | 'compact'

const NOTE_LAYOUT_STORAGE_KEY = 'jot.noteLayout'

const listeners = new Set<() => void>()

/** The note layout the user picked on this device; `compact` shows two smaller columns on phones. */
export function readNoteLayout(): NoteLayout {
  try {
    return localStorage.getItem(NOTE_LAYOUT_STORAGE_KEY) === 'compact'
      ? 'compact'
      : 'full'
  } catch {
    return 'full'
  }
}

/** Remembers `layout` and tells every subscriber, so the notes grid follows it. */
export function saveNoteLayout(layout: NoteLayout) {
  try {
    if (layout === 'full') localStorage.removeItem(NOTE_LAYOUT_STORAGE_KEY)
    else localStorage.setItem(NOTE_LAYOUT_STORAGE_KEY, layout)
  } catch {
    // Not remembered, but still applied for this visit.
  }
  for (const listener of listeners) listener()
}

/** Calls `onChange` when the layout changes here or in another tab. */
export function subscribeNoteLayout(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === NOTE_LAYOUT_STORAGE_KEY) onChange()
  }
  listeners.add(onChange)
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', onStorage)
  }
}
