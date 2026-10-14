import type { Folder } from './types'

/** A folder with the folders inside it, in the order they came (by name). */
export type FolderNode = Folder & { children: FolderNode[] }

/**
 * `folders` as a tree: the top-level folders, each with the folders inside it. A folder whose parent isn't
 * in `folders` goes at the top level, so none goes missing.
 */
export function buildFolderTree(folders: Folder[]): FolderNode[] {
  const nodes = new Map<number, FolderNode>(
    folders.map((folder) => [folder.id, { ...folder, children: [] }]),
  )
  const roots: FolderNode[] = []
  for (const node of nodes.values()) {
    const parent = node.parentId === null ? undefined : nodes.get(node.parentId)
    if (parent) parent.children.push(node)
    else roots.push(node)
  }
  return roots
}

/** The id of a folder and of every folder inside it, at any depth. */
export function withDescendants(folders: Folder[], id: number) {
  const ids = new Set([id])
  // Repeats until a pass adds nothing, since a folder can come before its parent.
  let grew = true
  while (grew) {
    grew = false
    for (const folder of folders) {
      if (
        folder.parentId !== null &&
        ids.has(folder.parentId) &&
        !ids.has(folder.id)
      ) {
        ids.add(folder.id)
        grew = true
      }
    }
  }
  return ids
}

/** The ids of the folders a folder is inside, nearest first. */
export function ancestorIds(folders: Folder[], id: number) {
  const byId = new Map(folders.map((folder) => [folder.id, folder]))
  const ids: number[] = []
  let parentId = byId.get(id)?.parentId ?? null
  while (parentId !== null && !ids.includes(parentId)) {
    ids.push(parentId)
    parentId = byId.get(parentId)?.parentId ?? null
  }
  return ids
}
