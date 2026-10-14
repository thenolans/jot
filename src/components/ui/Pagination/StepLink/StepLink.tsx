import type { ReactNode } from 'react'
import { Link, type To } from 'react-router'

import { pageItemClassName } from '../pageItemClassName'

type StepLinkProps = {
  /** The page it steps to. */
  page: number
  pageCount: number
  to: (page: number) => To
  label: string
  children: ReactNode
}

/** A link to the previous or next page, held in place but faded when there's no such page. */
export default function StepLink({
  page,
  pageCount,
  to,
  label,
  children,
}: StepLinkProps) {
  if (page < 1 || page > pageCount) {
    return (
      <span
        aria-hidden="true"
        className={pageItemClassName(
          false,
          'cursor-default opacity-50 hover:bg-transparent hover:text-muted',
        )}
      >
        {children}
      </span>
    )
  }
  return (
    <Link to={to(page)} aria-label={label} className={pageItemClassName()}>
      {children}
    </Link>
  )
}
