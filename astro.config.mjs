// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import icon from 'astro-icon'
import { unified } from '@astrojs/markdown-remark'
import remarkBreaks from 'remark-breaks'

export default defineConfig({
  trailingSlash: 'always',
  integrations: [icon()],
  markdown: {
    // Sätteri (the v7 default) has no soft-break option; the unified pipeline
    // keeps single newlines rendering as <br>, as the content relies on.
    processor: unified({ remarkPlugins: [remarkBreaks] })
  },
  vite: {
    plugins: [tailwindcss()]
  }
})
