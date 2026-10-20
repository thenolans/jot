import { useSyncExternalStore } from 'react'

import {
  readNoteLayout,
  saveNoteLayout,
  subscribeNoteLayout,
} from './noteLayout'

/** The chosen note layout and a setter that remembers it. */
export function useNoteLayout() {
  const layout = useSyncExternalStore(subscribeNoteLayout, readNoteLayout)
  return [layout, saveNoteLayout] as const
}
