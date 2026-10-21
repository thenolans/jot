/** Moves the row at index `from` to index `to`. */
export function moveRow<T>(rows: T[], from: number, to: number) {
  if (
    from === to ||
    from < 0 ||
    to < 0 ||
    from >= rows.length ||
    to >= rows.length
  )
    return rows
  const moved = [...rows]
  moved.splice(to, 0, ...moved.splice(from, 1))
  return moved
}
