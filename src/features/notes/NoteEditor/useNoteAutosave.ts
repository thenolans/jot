import { useEffect, useEffectEvent, useRef, useState } from 'react'

import type { Note, NoteChanges } from '../types'
import { useUpdateNote } from '../useUpdateNote'

/** How long typing has to pause before what's typed is saved. */
const SAVE_DELAY_MS = 500

type NoteDraft = Required<NoteChanges>

/** The fields of `draft` that differ from `saved`, or `null` when none do. */
function changesFrom(draft: NoteDraft, saved: NoteDraft) {
  const changes: NoteChanges = {}
  if (draft.title !== saved.title) changes.title = draft.title
  if (draft.content !== saved.content) changes.content = draft.content
  return Object.keys(changes).length ? changes : null
}

/**
 * The note's title and text as they're being edited, and a way to change them. Changes are saved once
 * typing pauses, and straight away when the editor closes or the app is put away.
 */
export function useNoteAutosave(note: Note) {
  const [draft, setDraft] = useState<NoteDraft>({
    title: note.title,
    content: note.content,
  })
  const { mutate } = useUpdateNote()
  // What has been sent, so each save sends only what's changed since.
  const sent = useRef(draft)

  const save = useEffectEvent((toSave: NoteDraft) => {
    const changes = changesFrom(toSave, sent.current)
    if (!changes) return
    sent.current = toSave
    mutate({ id: note.id, changes })
  })
  const saveLatest = useEffectEvent(() => save(draft))

  useEffect(() => {
    const timer = setTimeout(() => save(draft), SAVE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [draft])

  // A phone may close the app once it's in the background, so save what's waiting when it goes there.
  useEffect(() => {
    const saveIfHidden = () => {
      if (document.visibilityState === 'hidden') saveLatest()
    }
    document.addEventListener('visibilitychange', saveIfHidden)
    return () => {
      document.removeEventListener('visibilitychange', saveIfHidden)
      saveLatest()
    }
  }, [])

  const change = (changes: NoteChanges) =>
    setDraft((current) => ({ ...current, ...changes }))

  return [draft, change] as const
}
