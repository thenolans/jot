/**
 * A count with its noun, e.g. "1 note" or "3 notes". Pass `pluralForm` when adding "s" isn't
 * right: `plural(n, 'note matches', 'notes match')`.
 */
export function plural(
  count: number,
  singular: string,
  pluralForm = `${singular}s`,
) {
  return `${count} ${count === 1 ? singular : pluralForm}`
}
