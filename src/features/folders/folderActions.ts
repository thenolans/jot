import type { Folder } from './types'

/** Something to do from the folder nav: name a new folder (inside `parent`, if given), or act on one. */
export type FolderAction =
  | { kind: 'create'; parent?: Folder }
  | { kind: 'rename' | 'move' | 'delete'; folder: Folder }

/** What the dialog or view carrying out `action` is called. */
export function folderActionTitle(action: FolderAction) {
  switch (action.kind) {
    case 'create':
      return action.parent
        ? `New folder in “${action.parent.name}”`
        : 'New folder'
    case 'rename':
      return 'Rename folder'
    case 'move':
      return `Move “${action.folder.name}”`
    case 'delete':
      return `Delete “${action.folder.name}”?`
  }
}
