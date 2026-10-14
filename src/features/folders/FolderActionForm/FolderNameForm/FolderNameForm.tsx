import Button from '@/components/ui/Button'
import { DialogActions } from '@/components/ui/Dialog'
import TextField from '@/components/ui/TextField'
import { useFormAction } from '@/hooks/useFormAction'
import { useFormValidation } from '@/hooks/useFormValidation'

import type { Folder } from '../../types'
import { useCreateFolder } from '../../useCreateFolder'
import { useUpdateFolder } from '../../useUpdateFolder'

type FolderNameFormProps = {
  /** The folder to rename; without it, a folder is made. */
  folder?: Folder
  /** Where a new folder goes: inside this folder, or at the top level when left out. */
  parent?: Folder
  /** Called by Cancel, and once it's saved. */
  onDone: () => void
}

const fields = ['name'] as const

/** A folder's name, to make a folder (at the top level or inside another) or rename one. */
export default function FolderNameForm({
  folder,
  parent,
  onDone,
}: FolderNameFormProps) {
  const create = useCreateFolder()
  const { mutate: update } = useUpdateFolder()
  const validation = useFormValidation()
  // It's saved straight away, online or off, so there's nothing to wait for.
  const [, formAction] = useFormAction(fields, async ({ name }) => {
    const trimmed = name.trim()
    if (trimmed !== folder?.name) {
      if (folder) update({ id: folder.id, changes: { name: trimmed } })
      else create({ name: trimmed, parentId: parent?.id ?? null })
    }
    onDone()
  })

  return (
    <form action={formAction} {...validation.formProps}>
      <TextField
        label="Name"
        name="name"
        required
        // Spaces alone aren't a name.
        pattern=".*\S.*"
        data-pattern-message="Name is required."
        maxLength={255}
        autoComplete="off"
        // Password managers take a field called "Name" for the user's own and offer to fill it.
        data-1p-ignore
        // `data-autofocus` as a dialog opens with it, `autoFocus` as it replaces a view in one already open.
        data-autofocus
        autoFocus
        defaultValue={folder?.name}
        onFocus={(event) => event.currentTarget.select()}
        error={validation.errors.name}
      />
      <DialogActions>
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit">{folder ? 'Save' : 'Make folder'}</Button>
      </DialogActions>
    </form>
  )
}
