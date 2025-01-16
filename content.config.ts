import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        title: z.string(),
        showTitle: z.boolean().default(true),
        banner: z.string(),
        gallery: z.array(z.string())
      })
    })
  }
})

