import { Link, type To } from 'react-router'

import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon'
import ChevronRightIcon from '@/components/icons/ChevronRightIcon'
import { cx } from '@/lib/cx'

import { pageItemClassName } from './pageItemClassName'
import { GAP, pageItems } from './pageItems'
import StepLink from './StepLink'

type PaginationProps = {
  /** The current page, from 1. */
  page: number
  pageCount: number
  /** Where each page lives, such as the list's URL with a `page` search param. */
  to: (page: number) => To
  /** Accessible name for the navigation. */
  label?: string
  className?: string
}

/**
 * Links to the pages of a list, sitting on the page with only the current page filled in. Long runs
 * of pages collapse into gaps around the current one.
 */
export default function Pagination({
  page,
  pageCount,
  to,
  label = 'Pagination',
  className,
}: PaginationProps) {
  const items = pageItems(page, pageCount)

  return (
    <nav aria-label={label} className={cx('inline-flex gap-1', className)}>
      <StepLink
        page={page - 1}
        pageCount={pageCount}
        to={to}
        label="Previous page"
      >
        <ChevronLeftIcon />
      </StepLink>

      <ol className="flex gap-1">
        {items.map((item, index) =>
          item === GAP ? (
            <li
              key={`gap-${index}`}
              aria-hidden="true"
              className="inline-flex size-8 items-center justify-center text-faint"
            >
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                to={to(item)}
                aria-label={`Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                className={pageItemClassName(item === page)}
              >
                {item}
              </Link>
            </li>
          ),
        )}
      </ol>

      <StepLink page={page + 1} pageCount={pageCount} to={to} label="Next page">
        <ChevronRightIcon />
      </StepLink>
    </nav>
  )
}
