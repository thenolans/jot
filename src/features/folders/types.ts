export type Folder = {
  id: number
  name: string
  /** The folder it's inside, or `null` at the top level. */
  parentId: number | null
  /**
   * Marked private: its notes, and those in the folders inside it, are left out of every note and its
   * search. A folder inside a private one is private too, whatever this says (see `privateFolderIds`).
   */
  isPrivate: boolean
  /** Notes filed directly in it, not those in the folders inside it. */
  noteCount: number
}

/** What a new folder is made with. */
export type NewFolder = Pick<Folder, 'name' | 'parentId'>

/** What can be changed about a folder: its name, where it is (to move it), or whether it's private. */
export type FolderChanges = Partial<
  Pick<Folder, 'name' | 'parentId' | 'isPrivate'>
>
