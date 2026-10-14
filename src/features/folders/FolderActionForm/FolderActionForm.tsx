import type { FolderAction as Action } from '../folderActions'
import type { Folder } from '../types'
import DeleteFolderConfirm from './DeleteFolderConfirm'
import FolderNameForm from './FolderNameForm'
import MoveFolderForm from './MoveFolderForm'

type FolderActionFormProps = {
  action: Action
  folders: Folder[]
  /** Called once it's done or called off, to close the dialog or view it's in. */
  onDone: () => void
}

/**
 * The form carrying out a folder nav's action, for a dialog (`FolderActionDialog`) or a view in the
 * folder sheet to hold, titled with `folderActionTitle`.
 */
export default function FolderActionForm({
  action,
  folders,
  onDone,
}: FolderActionFormProps) {
  switch (action.kind) {
    case 'create':
      return <FolderNameForm parent={action.parent} onDone={onDone} />
    case 'rename':
      return <FolderNameForm folder={action.folder} onDone={onDone} />
    case 'move':
      return (
        <MoveFolderForm
          folder={action.folder}
          folders={folders}
          onDone={onDone}
        />
      )
    case 'delete':
      return (
        <DeleteFolderConfirm
          folder={action.folder}
          folders={folders}
          onDone={onDone}
        />
      )
  }
}
