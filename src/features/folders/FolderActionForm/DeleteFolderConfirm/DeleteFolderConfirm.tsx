import Button from '@/components/ui/Button'
import { DialogActions } from '@/components/ui/Dialog'
import { plural } from '@/lib/plural'

import { withDescendants } from '../../folderTree'
import type { Folder } from '../../types'
import { useDeleteFolder } from '../../useDeleteFolder'

type DeleteFolderConfirmProps = {
  folder: Folder
  folders: Folder[]
  /** Called by Keep, and once it's deleted. */
  onDone: () => void
}

/** Asks before deleting a folder, saying what's inside it that goes too, then deletes it. */
export default function DeleteFolderConfirm({
  folder,
  folders,
  onDone,
}: DeleteFolderConfirmProps) {
  const { mutate: deleteFolder } = useDeleteFolder()

  const deleted = withDescendants(folders, folder.id)
  const subfolderCount = deleted.size - 1
  // Each folder counts only its own notes, so the subfolders' are added in.
  const noteCount = folders
    .filter((each) => deleted.has(each.id))
    .reduce((total, each) => total + each.noteCount, 0)
  const contents = [
    noteCount > 0 && plural(noteCount, 'note'),
    subfolderCount > 0 && plural(subfolderCount, 'folder'),
  ].filter(Boolean)

  return (
    <div>
      <p className="text-base text-muted">
        {contents.length > 0
          ? `This also deletes the ${contents.join(' and ')} inside it. This can't be undone.`
          : "It's empty, so nothing else is deleted."}
      </p>
      <DialogActions>
        <Button variant="secondary" onClick={onDone}>
          Keep folder
        </Button>
        {/* It goes straight away, online or off, so there's nothing to wait for. */}
        <Button
          variant="danger"
          onClick={() => {
            deleteFolder(folder.id)
            onDone()
          }}
        >
          Delete folder
        </Button>
      </DialogActions>
    </div>
  )
}
