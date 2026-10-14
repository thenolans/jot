export type Folder = {
  id: number
  name: string
  /** The folder it's inside, or `null` at the top level. */
  parentId: number | null
  /** Notes in it, including those in the folders inside it. */
  noteCount: number
}

/** What a new folder is made with. */
export type NewFolder = Pick<Folder, 'name' | 'parentId'>

/** What can be changed about a folder: its name, or where it is (to move it). */
export type FolderChanges = Partial<Pick<Folder, 'name' | 'parentId'>>
