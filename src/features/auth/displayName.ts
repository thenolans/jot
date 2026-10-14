import type { Person } from './types'

/**
 * How to show a person: their name, with their email beneath it, or just their email when they have
 * no name. Accounts made outside the app (e.g. `createsuperuser`) can have no name.
 */
export const displayDetails = (
  person: Person,
): { title: string; subtitle?: string } => {
  const name = person.name.trim()
  if (!name) return { title: person.email ?? 'Someone' }
  return person.email
    ? { title: name, subtitle: person.email }
    : { title: name }
}

/** The name to show for a person: their name, or their email when they have none. */
export const displayName = (person: Person) => displayDetails(person).title
