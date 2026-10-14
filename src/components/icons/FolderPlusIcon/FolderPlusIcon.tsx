import Icon from '@/components/icons/Icon'
import type { IconProps } from '@/components/icons/types'

/** A folder with a plus, for making a folder. */
export default function FolderPlusIcon({ size = 16, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M3 6 A2 2 0 0 1 5 4 H8 L10 6.5 H15 A2 2 0 0 1 17 8.5 V14 A2 2 0 0 1 15 16 H5 A2 2 0 0 1 3 14 Z" />
      <path d="M10 9 V13.5 M7.75 11.25 H12.25" />
    </Icon>
  )
}
