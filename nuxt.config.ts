// https://nuxt.com/docs/api/configuration/nuxt-config
import { readdirSync, statSync, writeFileSync } from 'fs'
import { join, relative } from 'path'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  experimental: { appManifest: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/content'],
  hooks: {
    'build:before': () => {
      const publicImgPath = join(process.cwd(), 'public')
      function getAllFiles(dir: string): string[] {
        const files = readdirSync(dir)
        return files.flatMap(file => {
          const fullPath = join(dir, file)
          return statSync(fullPath).isDirectory()
            ? getAllFiles(fullPath)
            : '/' + relative(publicImgPath, fullPath).replace(/\\/g, '/')
        })
      }

      const imageList = getAllFiles(publicImgPath)

      // Write images to JSON file
      const jsonPath = join(publicImgPath, 'images.json')
      writeFileSync(jsonPath, JSON.stringify(imageList, null, 2))
    }
  }
})