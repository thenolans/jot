import { useIsMutating } from '@tanstack/react-query'
import { useEffect, useEffectEvent, useRef, useState } from 'react'

import type { Note, NoteChanges } from '../types'
import { useDeleteNote } from '../useDeleteNote'
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

/** Whether `a` is a later time than `b`, both ISO dates. */
const isLater = (a: string, b: string) => Date.parse(a) > Date.parse(b)

/**
 * The note's title and text as they're being edited, and a way to change them. Changes are saved once
 * typing pauses, and straight away when the editor closes or the app is put away. With
 * `discardIfEmpty` (a note just created), closing the editor with nothing written deletes the note.
 *
 * The note may have been edited elsewhere since it was cached (on another device), so when a later
 * version arrives, it replaces each field not changed here since the last save. Otherwise the next save
 * would write over it with the older text.
 */
export function useNoteAutosave(note: Note, discardIfEmpty: boolean) {
  const [draft, setDraft] = useState<NoteDraft>({
    title: note.title,
    content: note.content,
  })
  const { mutate } = useUpdateNote()
  const { mutate: deleteNote } = useDeleteNote()
  // What has been sent, so each save sends only what's changed since.
  const sent = useRef(draft)
  // When the version the draft is based on was saved: the note as opened, or as this editor or another
  // device last saved it. The API trims what it saves, so the text alone can't tell a later version
  // from this editor's own save.
  const savedAt = useRef(note.updatedAt)
  // While a change is on its way, the cached note may be older than what's been sent.
  const isSending =
    useIsMutating({
      predicate: (mutation) => !!mutation.options.meta?.keepOffline,
    }) > 0

  const save = useEffectEvent((toSave: NoteDraft) => {
    const changes = changesFrom(toSave, sent.current)
    if (!changes) return
    sent.current = toSave
    mutate(
      { id: note.id, changes },
      {
        onSuccess: (saved) => {
          if (isLater(saved.updatedAt, savedAt.current))
            savedAt.current = saved.updatedAt
        },
      },
    )
  })

  const takeLaterVersion = useEffectEvent(() => {
    if (isSending || !isLater(note.updatedAt, savedAt.current)) return
    const latest = { title: note.title, content: note.content }
    if (!changesFrom(latest, sent.current)) return
    savedAt.current = note.updatedAt
    const unchanged = (field: keyof NoteDraft) =>
      draft[field] === sent.current[field]
    const next = {
      title: unchanged('title') ? latest.title : draft.title,
      content: unchanged('content') ? latest.content : draft.content,
    }
    sent.current = latest
    setDraft(next)
  })
  useEffect(() => {
    takeLaterVersion()
  }, [note.updatedAt, note.title, note.content, isSending])
  const saveLatest = useEffectEvent(() => save(draft))
  // The delete waits a moment, so the cleanup React runs when it mounts the editor twice in development
  // doesn't delete the note: mounting again cancels it.
  const discardTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const saveOrDiscard = useEffectEvent(() => {
    if (discardIfEmpty && !draft.title.trim() && !draft.content.trim())
      discardTimer.current = setTimeout(() => deleteNote(note.id))
    else save(draft)
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
