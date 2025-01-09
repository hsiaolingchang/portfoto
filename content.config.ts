import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        title: z.string(),
        banner: z.string(),
        gallery: z.array(z.string())
      })
    }),
    common: defineCollection({
      type: 'data',
      source: '**/*.yml',
      schema: z.object({
        title: z.string(),
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        logo: z.string(),
        avatar: z.string(),
        instagram: z.string(),
        facebook: z.string(),
        twitter: z.string(),
        linkedin: z.string(),
        github: z.string()
      })
    })
  }
})

