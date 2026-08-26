// Generates the /public/resized/{small,large} webp variants used by <ResizedImg>.
import { existsSync, mkdirSync, cpSync } from 'node:fs'
import { dirname, join } from 'node:path'
import sharp from 'sharp'
import { contentDir, imageSizes, listImages, publicDir, resizedSrc, root, sourceDir } from '../src/lib/paths.mjs'

// The example content ships its own images; surface them as /example sources.
if (contentDir.endsWith('content.example')) {
  const src = join(root, 'content.example', 'public')
  if (existsSync(src)) cpSync(src, join(sourceDir, 'example'), { recursive: true })
}

const pending = listImages()
  .flatMap((src) =>
    Object.entries(imageSizes).map(([size, width]) => ({
      from: join(sourceDir, src),
      to: join(publicDir, resizedSrc(src, size)),
      width
    }))
  )
  .filter((job) => !existsSync(job.to))

console.log(`Generating resized images (${pending.length} missing)...`)

// Bounded so a cold run doesn't queue thousands of sharp jobs at once.
const queue = pending[Symbol.iterator]()
await Promise.all(
  Array.from({ length: 12 }, async () => {
    for (const job of queue) {
      mkdirSync(dirname(job.to), { recursive: true })
      try {
        await sharp(job.from)
          .resize(job.width, null, { fit: 'inside', withoutEnlargement: true })
          .webp()
          .toFile(job.to)
      } catch (error) {
        console.error(`Error resizing ${job.from}:`, error)
      }
    }
  })
)

console.log('Done.')
