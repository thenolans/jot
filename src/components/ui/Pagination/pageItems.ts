/** A gap in the page numbers, standing for the pages between its neighbors. */
export const GAP = 'gap'

/**
 * The page numbers to show for `page` of `pageCount`: always the first and last pages, `page` and
 * `siblings` pages either side, with gaps for the rest. Past a few pages the list keeps one length,
 * so the control doesn't change width as the page changes.
 */
export function pageItems(
  page: number,
  pageCount: number,
  siblings = 1,
): (number | typeof GAP)[] {
  // First, last, the current page and its siblings, and a gap on each side.
  const length = 2 * siblings + 5
  if (pageCount <= length) return range(1, pageCount)

  // How many pages a side shows when it has no gap: everything up to the far gap.
  const edgeLength = length - 2
  if (page <= siblings + 3) return [...range(1, edgeLength), GAP, pageCount]
  if (page >= pageCount - siblings - 2)
    return [1, GAP, ...range(pageCount - edgeLength + 1, pageCount)]
  return [1, GAP, ...range(page - siblings, page + siblings), GAP, pageCount]
}

function range(from: number, to: number) {
  return Array.from({ length: to - from + 1 }, (_, index) => from + index)
}
