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
 *
 * Deploy builds only get the committed public/resized/, not the originals, so
 * fall back to reading the generated variants back into source paths — folder
 * expansion in frontmatter ("/img/a/") needs this list either way.
 */
export function listImages() {
  if (existsSync(sourceDir)) return scan(sourceDir, (name) => imageExts.some((ext) => name.toLowerCase().endsWith(ext)))

  const variants = join(publicDir, 'resized', Object.keys(imageSizes)[0])
  return existsSync(variants) ? scan(variants, (name) => name.endsWith('.webp')).map((src) => src.slice(0, -'.webp'.length)) : []
}

/** Files under dir matching `keep`, as site paths relative to it. */
function scan(dir, keep) {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && keep(entry.name))
    .map((entry) => '/' + relative(dir, join(entry.parentPath, entry.name)).replace(/\\/g, '/'))
}

/** Site path of a generated variant: "/img/a.jpg" -> "/resized/small/img/a.jpg.webp" */
export function resizedSrc(src, size) {
  return `/resized/${size}${src}.webp`
}
