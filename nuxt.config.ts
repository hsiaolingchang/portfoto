// https://nuxt.com/docs/api/configuration/nuxt-config
import { readdirSync, statSync, writeFileSync, readFileSync, existsSync } from 'fs'
import { join, relative, resolve } from 'path'
import yaml from 'yaml'

export const contentDir = () => {
  const contentPath = resolve(__dirname, 'content')
  const examplePath = resolve(__dirname, 'content.example')
  return existsSync(contentPath) ? contentPath : examplePath
}

export default defineNuxtConfig({
  content: {
    build: {
      pathMeta: {},
      markdown: {
        remarkPlugins: {
          'remark-breaks': {}
        }
      }
    }
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('swiper-')
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  experimental: { appManifest: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/content', '@nuxt/image'],
  image: {
    quality: 75
  },
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
      const infoPath = join(contentDir(), 'info.yml')
      const infoJsonPath = join(publicImgPath, 'info.json')
      const infoYaml = readFileSync(infoPath, 'utf8')
      const infoData = yaml.parse(infoYaml)
      writeFileSync(infoJsonPath, JSON.stringify(infoData, null, 2))
    }
  }
})