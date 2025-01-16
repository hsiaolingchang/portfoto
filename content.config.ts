import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { contentDir } from './nuxt.config'

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
        showTitle: z.boolean().default(true),
        banner: z.string(),
        gallery: z.array(z.string())
      })
    })
  }
})

