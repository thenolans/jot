import Button from '@/components/ui/Button'
import { DialogActions } from '@/components/ui/Dialog'
import { useFormAction } from '@/hooks/useFormAction'

import FolderPicker, { pickedFolderId } from '../../FolderPicker'
import { withDescendants } from '../../folderTree'
import type { Folder } from '../../types'
import { useUpdateFolder } from '../../useUpdateFolder'

type MoveFolderFormProps = {
  folder: Folder
  folders: Folder[]
  /** Called by Cancel, and once it's moved. */
  onDone: () => void
}

const fields = ['parentId'] as const

/** Moves a folder to the top level or into another folder (not itself or one inside it). */
export default function MoveFolderForm({
  folder,
  folders,
  onDone,
}: MoveFolderFormProps) {
  const { mutate: update } = useUpdateFolder()
  // It moves straight away, online or off, so there's nothing to wait for.
  const [, formAction] = useFormAction(fields, async ({ parentId }) => {
    const to = pickedFolderId(parentId)
    if (to !== folder.parentId)
      update({ id: folder.id, changes: { parentId: to } })
    onDone()
  })

  return (
    <form action={formAction}>
      <FolderPicker
        name="parentId"
        label="Move to"
        folders={folders}
        current={folder.parentId}
        noneLabel="Top level"
        exclude={withDescendants(folders, folder.id)}
      />
      <DialogActions>
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit">Move</Button>
      </DialogActions>
    </form>
  )
}
