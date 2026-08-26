import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'
import { contentDir, fileToId } from './lib/site'

const content = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: contentDir(),
    generateId: ({ entry }) => fileToId(entry)
  }),
  schema: z.object({
    title: z.string().optional(),
    showTitle: z.boolean().default(true),
    banner: z.array(z.string()).optional(),
    gallery: z.array(z.string()).optional()
  })
})

export const collections = { content }
