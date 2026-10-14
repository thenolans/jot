import Dialog, { useDialog } from '@/components/ui/Dialog'

import FolderActionForm from '../FolderActionForm'
import {
  type FolderAction as Action,
  folderActionTitle,
} from '../folderActions'
import type { Folder } from '../types'

type FolderActionDialogProps = {
  action: Action
  folders: Folder[]
  onClose: () => void
}

/** A folder nav's action in a dialog of its own. Render it to open it. */
export default function FolderActionDialog({
  action,
  folders,
  onClose,
}: FolderActionDialogProps) {
  const { dialogRef, close } = useDialog()

  return (
    <Dialog
      dialogRef={dialogRef}
      title={folderActionTitle(action)}
      onClose={onClose}
    >
      <FolderActionForm action={action} folders={folders} onDone={close} />
    </Dialog>
  )
}
