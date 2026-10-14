import { useEffect, useSyncExternalStore } from 'react'
import { useSearchParams } from 'react-router'

import { isLocalId, resolveId, subscribeSavedIds } from '@/lib/localIds'

/**
 * Once a folder made offline is saved, swaps its local id in the URL's `folder` param for its saved id,
 * so the page shows it as the folder it now is, and the link keeps working.
 */
export function useSavedFolderParam() {
  const [searchParams, setSearchParams] = useSearchParams()
  const param = Number(searchParams.get('folder'))
  const savedId = useSyncExternalStore(subscribeSavedIds, () =>
    resolveId(param),
  )

  useEffect(() => {
    if (!isLocalId(param) || savedId === param) return
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        next.set('folder', String(savedId))
        return next
      },
      { replace: true, preventScrollReset: true },
    )
  }, [savedId, param, setSearchParams])
}
