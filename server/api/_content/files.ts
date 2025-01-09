import { readdir } from 'fs/promises'
import { resolve } from 'path'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const prefix = query.prefix as string

  if (!prefix) {
    throw createError({
      statusCode: 400,
      message: 'prefix parameter is required'
    })
  }

  // Remove leading slash and ensure it's within public directory
  const cleanPrefix = prefix.replace(/^\//, '')
  const dirPath = resolve(process.cwd(), 'public', cleanPrefix)

  try {
    const files = await readdir(dirPath)
    // Filter for image files and return full paths
    const imageFiles = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(file))
      .map(file => `/${cleanPrefix}${file}`)
    
    return imageFiles
  } catch (error) {
    console.error('Error reading directory:', error)
    return []
  }
}) 