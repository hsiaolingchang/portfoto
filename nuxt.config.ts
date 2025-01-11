// https://nuxt.com/docs/api/configuration/nuxt-config
import { readdirSync, statSync, writeFileSync, readFileSync } from 'fs'
import { join, relative } from 'path'
import yaml from 'yaml'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  experimental: { appManifest: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/content'],
  ssr: false,
  hooks: {
    'build:before': () => {
      // Handle images list
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

      // Handle info.yml to info.json conversion
      const infoPath = join(process.cwd(), 'content/info.yml')
      const infoJsonPath = join(publicImgPath, 'info.json')
      const infoYaml = readFileSync(infoPath, 'utf8')
      const infoData = yaml.parse(infoYaml)
      writeFileSync(infoJsonPath, JSON.stringify(infoData, null, 2))
    }
  }
})