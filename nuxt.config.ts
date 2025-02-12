// https://nuxt.com/docs/api/configuration/nuxt-config
import { readdirSync, statSync, writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { join, relative, resolve, dirname, extname } from 'path'
import yaml from 'yaml'
import sharp from 'sharp'

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
  modules: ['@nuxtjs/tailwindcss', '@nuxt/content'],
  ssr: false,
  hooks: {
    'build:before': async () => {
      const publicImgPath = join(process.cwd(), 'public')
      const thumbnailsDir = join(publicImgPath, 'thumbnails')

      // Create thumbnails directory if it doesn't exist
      if (!existsSync(thumbnailsDir)) {
        mkdirSync(thumbnailsDir, { recursive: true })
      }

      // Modified getAllFiles function to process images
      async function getAllFiles(dir: string): Promise<string[]> {
        const files = readdirSync(dir)
        const allFiles: string[] = []

        for (const file of files) {
          const fullPath = join(dir, file)
          
          if (statSync(fullPath).isDirectory()) {
            if (file !== 'thumbnails') { // Skip thumbnails directory
              allFiles.push(...await getAllFiles(fullPath))
            }
          } else {
            const ext = extname(file).toLowerCase()
            if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
              const relativePath = '/' + relative(publicImgPath, fullPath).replace(/\\/g, '/')
              allFiles.push(relativePath)

              // Create thumbnail with same relative path structure
              const relativeDir = relative(publicImgPath, dir)
              const thumbnailDir = join(thumbnailsDir, relativeDir)
              const thumbnailPath = join(thumbnailDir, file)

              // Create directory structure if it doesn't exist
              if (!existsSync(thumbnailDir)) {
                mkdirSync(thumbnailDir, { recursive: true })
              }

              try {
                await sharp(fullPath)
                  .resize(360, 360, {
                    fit: 'outside',
                    withoutEnlargement: true
                  })
                  .toFile(thumbnailPath)
              } catch (error) {
                console.error(`Error creating thumbnail for ${file}:`, error)
              }
            }
          }
        }
        return allFiles
      }

      // Get all images and create thumbnails
      
      console.log("Generating thumbnails...")
      const imageList = await getAllFiles(publicImgPath)

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