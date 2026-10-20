import type { To } from 'react-router'

import type { Folder } from '../types'
import type { FolderNavVariant } from './folderNavVariants'

/** What each row of a `FolderNav` needs from it. */
export type FolderNavState = {
  variant: FolderNavVariant
  activeFolderId: number | null
  folderTo: (id: number) => To
  onNavigate?: () => void
  isOpen: (id: number) => boolean
  toggle: (id: number) => void
  /** Open a folder's dialogs, from its menu. */
  rename: (folder: Folder) => void
  createIn: (parent: Folder) => void
  move: (folder: Folder) => void
  remove: (folder: Folder) => void
}
