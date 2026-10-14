/**
 * Ids for notes and folders made offline, before the API has given them one. They're negative, so they
 * never clash with the API's. Once one is saved, its saved id is remembered on the device, so changes to
 * it still waiting for the connection (kept even after the app is closed) are sent to the saved one.
 */

import { ApiError } from './api'

const STORAGE_KEY = 'jot.savedIds'

let lastLocalId = 0

function readSaved(): Record<string, number> {
  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? '{}',
    )
    return typeof stored === 'object' && stored !== null
      ? (stored as Record<string, number>)
      : {}
  } catch {
    return {}
  }
}

let saved = readSaved()
const listeners = new Set<() => void>()

/** A new local id, unlike any made before on this device (it counts down from the time). */
export function newLocalId() {
  lastLocalId = Math.min(lastLocalId - 1, -Date.now())
  return lastLocalId
}

/** Whether `id` was made on the device, rather than by the API. */
export function isLocalId(id: number) {
  return id < 0
}

/** `id`, or for a local id that's been saved, the id the API gave it. */
export function resolveId(id: number) {
  return saved[id] ?? id
}

/**
 * The id to send the API for `id`. A local id that hasn't been saved fails as not found: changes wait for
 * the one that makes it, so it couldn't be made.
 */
export function apiId(id: number) {
  const resolved = resolveId(id)
  if (isLocalId(resolved))
    throw new ApiError(404, 'This was never saved, so it was lost.')
  return resolved
}

/** Whether two ids are for the same thing, though one is local and the other its saved id. */
export function isSameId(a: number, b: number) {
  return resolveId(a) === resolveId(b)
}

/** Remembers the id the API gave what was made with `localId`. */
export function recordSavedId(localId: number, id: number) {
  saved = { ...saved, [localId]: id }
  for (const listener of listeners) listener()
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  } catch {
    // Storage unavailable (e.g. private mode): it's remembered until reload.
  }
}

/** Calls `listener` whenever a local id is saved; returns a function to stop. */
export function subscribeSavedIds(listener: () => void) {
  listeners.add(listener)
  return () => void listeners.delete(listener)
}

/** Forgets every saved id, as the changes that used them go when the user signs out. */
export function clearSavedIds() {
  saved = {}
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing was stored.
  }
}
