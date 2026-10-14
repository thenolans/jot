import type { ReactNode } from 'react'

import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon'
import Heading from '@/components/ui/Heading'
import IconButton from '@/components/ui/IconButton'
import { cx } from '@/lib/cx'

type ModalSubviewProps = {
  title: ReactNode
  /** Goes back to the view it was opened from. */
  onBack: () => void
  children: ReactNode
  className?: string
}

/**
 * A view opened from a modal's main view (see `useModalView`), like the confirmation to delete a note:
 * a back button and a title above its content. The back button takes focus when it opens.
 */
export default function ModalSubview({
  title,
  onBack,
  children,
  className,
}: ModalSubviewProps) {
  return (
    <div className={cx('flex flex-col gap-4 px-6 pb-6', className)}>
      <div className="flex items-center gap-2">
        <IconButton
          size="lg"
          onClick={onBack}
          aria-label="Back"
          autoFocus
          className="-ml-2"
        >
          <ChevronLeftIcon size={20} />
        </IconButton>
        <Heading as="h2" variant="subsection" className="min-w-0 truncate">
          {title}
        </Heading>
      </div>
      {children}
    </div>
  )
}
