import Alert from '@/components/ui/Alert'
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
  const { mutateAsync: create } = useCreateFolder()
  const { mutateAsync: update } = useUpdateFolder()
  const validation = useFormValidation()
  const [state, formAction, isPending] = useFormAction(
    fields,
    async ({ name }) => {
      const trimmed = name.trim()
      if (trimmed !== folder?.name) {
        if (folder) await update({ id: folder.id, changes: { name: trimmed } })
        else await create({ name: trimmed, parentId: parent?.id ?? null })
      }
      onDone()
    },
  )

  return (
    <form action={formAction} {...validation.formProps}>
      {state.message && <Alert className="mb-4">{state.message}</Alert>}
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
        defaultValue={state.values.name ?? folder?.name}
        onFocus={(event) => event.currentTarget.select()}
        error={validation.errors.name ?? state.fieldErrors.name}
      />
      <DialogActions>
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {folder
            ? isPending
              ? 'Saving…'
              : 'Save'
            : isPending
              ? 'Making…'
              : 'Make folder'}
        </Button>
      </DialogActions>
    </form>
  )
}
