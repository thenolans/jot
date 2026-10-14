import { type To, useSearchParams } from 'react-router'

import { notePath } from '@/app/paths'

/**
 * The note filters and page, kept in the URL (`?q=…&folder=…&page=…`) so they survive reloads and can
 * be linked to.
 */
export function useNoteSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() ?? ''
  const folderParam = Number(searchParams.get('folder'))
  const folderId =
    Number.isInteger(folderParam) && folderParam > 0 ? folderParam : null
  const pageParam = Number(searchParams.get('page'))
  const page = Number.isInteger(pageParam) && pageParam > 1 ? pageParam : 1

  // Changing the filters starts again from the first page.
  const updateFilters = (changes: Record<string, string | null>) =>
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        next.delete('page')
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value)
          else next.delete(key)
        }
        return next
      },
      { replace: true },
    )

  return {
    query,
    folderId,
    page,
    /** The list at `page`, with the same filters. */
    pageTo: (page: number): To => {
      const next = new URLSearchParams(searchParams)
      if (page > 1) next.set('page', String(page))
      else next.delete('page')
      return { search: next.toString() }
    },
    /** A note, open over the list with the same filters and page. */
    noteTo: (id: number): To => ({
      pathname: notePath(id),
      search: searchParams.toString(),
    }),
    hasFilters: query !== '' || folderId !== null,
    clearFilters: () => updateFilters({ q: null, folder: null }),
  }
}
