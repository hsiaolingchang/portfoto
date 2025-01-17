import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { resolve } from 'path'
import { existsSync } from 'fs'

const contentDir = () => {
  const contentPath = resolve(__dirname, 'content')
  const examplePath = resolve(__dirname, 'content.example')
  return existsSync(contentPath) ? contentPath : examplePath
}

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        cwd: contentDir()
      },
      schema: z.object({
        title: z.string(),
        showTitle: z.boolean().default(false),
        banner: z.array(z.string()),
        gallery: z.array(z.string())
      })
    })
  }
})

