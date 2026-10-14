import type { ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'

import { buttonClassName } from '@/components/ui/Button'
import { cx } from '@/lib/cx'

type FloatingActionLinkProps = Omit<LinkProps, 'children' | 'title'> & {
  icon: ReactNode
  /** Shown beside the icon on narrow screens; on wide ones it names the icon-only button. */
  label: string
}

/**
 * A page's main action, floating over its content: a labeled pill centered above the tab bar on
 * narrow screens, a round icon button in the bottom-right corner on wide ones.
 */
export default function FloatingActionLink({
  icon,
  label,
  className,
  ...props
}: FloatingActionLinkProps) {
  return (
    <Link
      title={label}
      className={buttonClassName(
        { size: 'sm' },
        cx(
          'fixed bottom-(--tab-bar-height) left-1/2 z-20 mb-4 -translate-x-1/2 rounded-full shadow-lifted focus-visible:shadow-focus [&_svg]:size-4',
          'md:right-8 md:bottom-8 md:left-auto md:mb-0 md:size-14 md:translate-x-0 md:px-0 md:[&_svg]:size-6',
          className,
        ),
      )}
      {...props}
    >
      {icon}
      <span className="md:sr-only">{label}</span>
    </Link>
  )
}
