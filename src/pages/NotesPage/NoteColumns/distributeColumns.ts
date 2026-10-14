/**
 * Deals `items` into `count` columns, each to whichever column is shortest so far, so the columns end up
 * close in height while the items still read roughly left to right, top to bottom.
 */
export function distributeColumns<T>(
  items: T[],
  count: number,
  estimateHeight: (item: T) => number,
) {
  const columns = Array.from({ length: count }, () => [] as T[])
  const heights = Array.from({ length: count }, () => 0)
  for (const item of items) {
    const shortest = heights.indexOf(Math.min(...heights))
    columns[shortest].push(item)
    heights[shortest] += estimateHeight(item)
  }
  return columns
}
