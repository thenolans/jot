/** The folder id a `FolderPicker` choice was read from the form as, or `null` for none. */
export function pickedFolderId(value: string) {
  return value ? Number(value) : null
}
