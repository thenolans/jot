import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import { DialogActions } from '@/components/ui/Dialog'
import { useFormAction } from '@/hooks/useFormAction'

import FolderPicker from '../../FolderPicker'
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
  const { mutateAsync: update } = useUpdateFolder()
  const [state, formAction, isPending] = useFormAction(
    fields,
    async ({ parentId }) => {
      const to = parentId ? Number(parentId) : null
      if (to !== folder.parentId)
        await update({ id: folder.id, changes: { parentId: to } })
      onDone()
    },
  )
  const error = state.fieldErrors.parentId ?? state.message

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
      {error && <Alert className="mt-4">{error}</Alert>}
      <DialogActions>
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Moving…' : 'Move'}
        </Button>
      </DialogActions>
    </form>
  )
}
