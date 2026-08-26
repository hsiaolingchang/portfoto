import { readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import yaml from 'yaml'
import { contentDir, listImages, root } from './paths.mjs'

export { contentDir, resizedSrc } from './paths.mjs'

type Info = {
  title: string
  description?: string
  name?: string
  slogan?: string
  email?: string
  phone?: string
  avatar?: string
  instagram?: string
  facebook?: string
  twitter?: string
  linkedin?: string
  github?: string
}

export const info: Info = yaml.parse(readFileSync(join(contentDir, 'info.yml'), 'utf8'))

const imagesByFolder = new Map<string, string[]>()
for (const image of listImages()) {
  const folder = image.split('/').slice(0, -1).join('/') + '/'
  const list = imagesByFolder.get(folder)
  if (list) list.push(image)
  else imagesByFolder.set(folder, [image])
}

/** Expands entries ending in "/" into every image of that folder. */
export function parseImageList(list?: string[]): string[] {
  if (!Array.isArray(list)) return []
  return list.flatMap((item) => (item.endsWith('/') ? imagesByFolder.get(item) ?? [] : item))
}

/** "1.Local culture" -> "local-culture" */
function slugify(name: string) {
  return stripOrder(name).trim().toLowerCase().replace(/[\s_]+/g, '-')
}

/** "1.Local culture" -> "Local Culture" */
function titleize(name: string) {
  return stripOrder(name).replace(/[-_]+/g, ' ').trim().replace(/\S+/g, (w) => w[0].toUpperCase() + w.slice(1))
}

function stripOrder(name: string) {
  return name.replace(/^\d+\./, '')
}

function order(name: string) {
  const match = name.match(/^(\d+)\./)
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY
}

/** Content file "1.work/1.Event/2.md" -> collection id "work/event/2" ("index" for the root page). */
export function fileToId(filePath: string) {
  const id = filePath
    .replace(/\.md$/, '')
    .split('/')
    .map(slugify)
    .filter(Boolean)
    .join('/')
    .replace(/(^|\/)index$/, '')
  return id || 'index'
}

/** Collection id -> site path, always with a trailing slash. */
export function idToPath(id: string) {
  return id === 'index' ? '/' : `/${id}/`
}

/** Site path -> the [...slug] param (undefined at the root). */
export function pathToParam(path: string) {
  const slug = path.replace(/^\/|\/$/g, '')
  return slug || undefined
}

export type NavNode = {
  title: string
  path: string
  /** false for folders without their own index.md — these render as expandable groups. */
  page: boolean
  children: NavNode[]
}

type Entry = { id: string; filePath?: string; data: { title?: string } }

type MutableNode = NavNode & { name: string; children: MutableNode[] }

function sortNodes(nodes: MutableNode[]) {
  nodes.sort((a, b) => order(a.name) - order(b.name) || a.name.localeCompare(b.name))
  for (const node of nodes) sortNodes(node.children)
  return nodes
}

let navigation: NavNode[] | undefined

/**
 * The sidebar tree, built from the content collection. The entries' original file
 * names still carry the numeric prefixes, so they drive ordering and folder titles,
 * while every URL comes from the entry id — one source for the slug rules.
 */
export function buildNavigation(entries: Entry[]): NavNode[] {
  if (navigation) return navigation

  const tree: MutableNode = { name: '', title: '', path: '/', page: true, children: [] }

  for (const entry of entries) {
    const names = relative(contentDir, resolve(root, entry.filePath ?? '')).split(/[\\/]/)
    const file = names.pop()!
    const path = idToPath(entry.id)
    // Folder paths are this path's leading segments, so the slug rules stay in fileToId.
    const segments = path.split('/')

    let parent = tree
    names.forEach((name, depth) => {
      let node = parent.children.find((child) => child.name === name)
      if (!node) {
        const folderPath = segments.slice(0, depth + 2).join('/') + '/'
        node = { name, title: titleize(name), path: folderPath, page: false, children: [] }
        parent.children.push(node)
      }
      parent = node
    })

    // index.md is the folder's own page rather than a nav entry of its own.
    if (file === 'index.md') {
      parent.page = true
      continue
    }

    parent.children.push({
      name: file.replace(/\.md$/, ''),
      title: entry.data.title ?? titleize(file.replace(/\.md$/, '')),
      path,
      page: true,
      children: []
    })
  }

  navigation = sortNodes(tree.children)
  return navigation
}

/** Folders that have no index.md — these need a generated listing page. */
export function listingFolders(nodes: NavNode[]): NavNode[] {
  return nodes.flatMap((node) => [...(node.page ? [] : [node]), ...listingFolders(node.children)])
}
