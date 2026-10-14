import { describe, expect, it } from 'vitest'

import { ancestorIds, buildFolderTree, withDescendants } from './folderTree'
import type { Folder } from './types'

const folder = (id: number, parentId: number | null = null): Folder => ({
  id,
  name: `Folder ${id}`,
  parentId,
  noteCount: 0,
})

// 1 holds 2, which holds 3; 4 is on its own. 3 comes before its parent.
const folders = [folder(3, 2), folder(1), folder(2, 1), folder(4)]

describe('buildFolderTree', () => {
  it('nests folders inside their parents, keeping their order', () => {
    const tree = buildFolderTree(folders)

    expect(tree.map(({ id }) => id)).toEqual([1, 4])
    expect(tree[0].children.map(({ id }) => id)).toEqual([2])
    expect(tree[0].children[0].children.map(({ id }) => id)).toEqual([3])
  })

  it('puts a folder whose parent is missing at the top level', () => {
    expect(buildFolderTree([folder(2, 9)]).map(({ id }) => id)).toEqual([2])
  })
})

describe('withDescendants', () => {
  it('includes the folder and every folder inside it', () => {
    expect(withDescendants(folders, 1)).toEqual(new Set([1, 2, 3]))
    expect(withDescendants(folders, 4)).toEqual(new Set([4]))
  })
})

describe('ancestorIds', () => {
  it('lists the folders above, nearest first', () => {
    expect(ancestorIds(folders, 3)).toEqual([2, 1])
    expect(ancestorIds(folders, 1)).toEqual([])
  })

  it('stops at a cycle', () => {
    expect(ancestorIds([folder(1, 2), folder(2, 1)], 1)).toEqual([2, 1])
  })
})
