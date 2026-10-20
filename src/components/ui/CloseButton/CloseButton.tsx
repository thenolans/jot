import type { ComponentProps } from 'react'

import CloseIcon from '@/components/icons/CloseIcon'
import IconButton from '@/components/ui/IconButton'
import { cx } from '@/lib/cx'

/**
 * The × that closes a modal, at the end of its header. Its negative margin lines the icon up with the
 * panel's padding.
 */
export default function CloseButton({
  className,
  ...props
}: Omit<ComponentProps<'button'>, 'children' | 'aria-label'>) {
  return (
    <IconButton
      size="lg"
      aria-label="Close"
      className={cx('-mr-2', className)}
      {...props}
    >
      <CloseIcon size={20} />
    </IconButton>
  )
}
