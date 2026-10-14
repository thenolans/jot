/**
 * A count with its noun, e.g. "1 serving" or "3 servings". Pass `pluralForm` when adding "s" isn't
 * right: `plural(n, 'recipe matches', 'recipes match')`.
 */
export function plural(
  count: number,
  singular: string,
  pluralForm = `${singular}s`,
) {
  return `${count} ${count === 1 ? singular : pluralForm}`
}
