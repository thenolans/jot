import { useIsMutating } from '@tanstack/react-query'
import { useEffect, useEffectEvent, useRef, useState } from 'react'

import { isSameId } from '@/lib/localIds'
import { isOfflineChange } from '@/lib/offlineQuery'

import { withoutEmptyItems } from '../checklist'
import { changesFrom, isSavedAs, mergeNote, textOf } from '../noteText'
import type { Note, NoteChanges, NoteText } from '../types'
import { useDeleteNote } from '../useDeleteNote'
import { useUpdateNote } from '../useUpdateNote'

/** How long typing has to pause before what's typed is saved. */
const SAVE_DELAY_MS = 500

/**
 * The note's title, text and whether it's a checklist as they're being edited, and a way to change them. Changes are saved once
 * typing pauses, and straight away when the editor closes (a checklist without its empty items) or the
 * app is put away. With
 * `discardIfEmpty` (a note just created), closing the editor with nothing written deletes the note.
 *
 * The note may have been edited elsewhere since it was cached (on another device), so when a later
 * version arrives, what's been typed since the last save is merged into it. When the two can't be merged,
 * the draft stays as it is, and its next save is merged with the API's version or saved as a copy (see
 * `setNoteMutationDefaults`).
 */
export function useNoteAutosave(note: Note, discardIfEmpty: boolean) {
  const [draft, setDraft] = useState<NoteText>(() => textOf(note))
  const { mutate } = useUpdateNote()
  const { mutate: deleteNote } = useDeleteNote()
  // What has been sent, so each save sends only what's changed since.
  const sent = useRef(draft)
  // The revision of the version the draft is based on: the note as opened, or as this editor or another
  // device last saved it. The API trims what it saves, so the text alone can't tell a later version
  // from this editor's own save.
  const revision = useRef(note.revision)
  // While a change is on its way, the cached note may be older than what's been sent.
  const isSending = useIsMutating({ predicate: isOfflineChange }) > 0

  const save = useEffectEvent((toSave: NoteText) => {
    const changes = changesFrom(toSave, sent.current)
    if (!changes) return
    const base = { ...sent.current, revision: revision.current }
    sent.current = toSave
    mutate(
      { id: note.id, changes, base },
      {
        // Saved as sent, rather than merged with edits made elsewhere or saved as a copy, which the
        // draft takes in as a later version.
        onSuccess: (saved) => {
          if (
            isSameId(saved.id, note.id) &&
            isSavedAs(saved, toSave) &&
            saved.revision > revision.current
          )
            revision.current = saved.revision
        },
      },
    )
  })

  const takeLaterVersion = useEffectEvent(() => {
    if (isSending || note.revision <= revision.current) return
    const latest = textOf(note)
    const merged = mergeNote(sent.current, draft, latest)
    if (!merged) return
    revision.current = note.revision
    sent.current = latest
    if (changesFrom(merged, draft)) setDraft(merged)
  })
  useEffect(() => {
    takeLaterVersion()
  }, [note.revision, isSending])
  const saveLatest = useEffectEvent(() => save(draft))
  // The delete waits a moment, so the cleanup React runs when it mounts the editor twice in development
  // doesn't delete the note: mounting again cancels it.
  const discardTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  // A checklist's empty items are left for typing in, so they go when it closes.
  const saveOrDiscard = useEffectEvent(() => {
    const closing = draft.isChecklist
      ? { ...draft, content: withoutEmptyItems(draft.content) }
      : draft
    if (discardIfEmpty && !closing.title.trim() && !closing.content.trim())
      discardTimer.current = setTimeout(() => deleteNote(note.id))
    else save(closing)
  })

  useEffect(() => {
    const timer = setTimeout(() => save(draft), SAVE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [draft])

  // A phone may close the app once it's in the background, so save what's waiting when it goes there.
  useEffect(() => {
    clearTimeout(discardTimer.current)
    const saveIfHidden = () => {
      if (document.visibilityState === 'hidden') saveLatest()
    }
    document.addEventListener('visibilitychange', saveIfHidden)
    return () => {
      document.removeEventListener('visibilitychange', saveIfHidden)
      saveOrDiscard()
    }
  }, [])

  const change = (changes: NoteChanges) =>
    setDraft((current) => ({ ...current, ...changes }))

  return [draft, change] as const
}
