// Where things live on disk, shared by the build (src/) and the image script
// (scripts/) so the folder layout is only described once.
import { existsSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'

export const root = process.cwd()
export const publicDir = join(root, 'public')

/**
 * Original photos live outside public/ so they are resized but never deployed —
 * only the generated variants under public/resized/ ship.
 */
export const sourceDir = join(root, 'source-images')

/** Real content when present, bundled example content otherwise. */
export const contentDir = existsSync(join(root, 'content'))
  ? join(root, 'content')
  : join(root, 'content.example')

export const imageSizes = { small: 480, large: 1920 }

const imageExts = ['.jpg', '.jpeg', '.png', '.webp']

/**
 * Every source image, as the site path its frontmatter uses ("/img/a/b.jpg").
 * Read lazily: the image script copies the example images in before calling it.
 */
export function listImages() {
  if (!existsSync(sourceDir)) return []

  return readdirSync(sourceDir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && imageExts.some((ext) => entry.name.toLowerCase().endsWith(ext)))
    .map((entry) => '/' + relative(sourceDir, join(entry.parentPath, entry.name)).replace(/\\/g, '/'))
}

/** Site path of a generated variant: "/img/a.jpg" -> "/resized/small/img/a.jpg.webp" */
export function resizedSrc(src, size) {
  return `/resized/${size}${src}.webp`
}
