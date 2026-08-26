// Where things live on disk, shared by the build (src/) and the image script
// (scripts/) so the folder layout is only described once.
import { existsSync, readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

export const root = process.cwd()
export const publicDir = join(root, 'public')
export const resizedDir = join(publicDir, 'resized')

export const imageExts = ['.jpg', '.jpeg', '.png', '.webp']
export const imageSizes = { small: 480, large: 1920 }

let contentPath
/** Real content when present, bundled example content otherwise. */
export function contentDir() {
  if (!contentPath) {
    const real = resolve(root, 'content')
    contentPath = existsSync(real) ? real : resolve(root, 'content.example')
  }
  return contentPath
}

/** Every image under /public, as absolute site paths. Skips the generated variants. */
export function listImages() {
  if (!existsSync(publicDir)) return []

  return readdirSync(publicDir, { recursive: true, withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        imageExts.some((ext) => entry.name.toLowerCase().endsWith(ext)) &&
        !relative(publicDir, entry.parentPath).split(/[\\/]/)[0].startsWith('resized')
    )
    .map((entry) => '/' + relative(publicDir, join(entry.parentPath, entry.name)).replace(/\\/g, '/'))
}

/** Site path of a generated variant: "/img/a.jpg" -> "/resized/small/img/a.jpg.webp" */
export function resizedSrc(src, size) {
  return `/resized/${size}${src}.webp`
}
