export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, message: 'No file provided' })
  }

  const fileField = formData.find(f => f.name === 'file')
  const folderField = formData.find(f => f.name === 'folder')
  const fullPathField = formData.find(f => f.name === 'fullPath')

  if (!fileField || !fileField.data) {
    throw createError({ statusCode: 400, message: 'No file provided' })
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
  if (fileField.type && !allowedTypes.includes(fileField.type)) {
    throw createError({ statusCode: 400, message: 'Invalid file type. Only images are allowed.' })
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (fileField.data.length > maxSize) {
    throw createError({ statusCode: 400, message: 'File too large. Maximum size is 5MB.' })
  }

  const folder = folderField?.data?.toString() || ''
  const fullPath = fullPathField?.data?.toString() === 'true'

  const cloudinaryForm = new FormData()
  const blob = new Blob([new Uint8Array(fileField.data)], { type: fileField.type || 'image/jpeg' })
  cloudinaryForm.append('file', blob, fileField.filename || 'upload')
  cloudinaryForm.append('upload_preset', config.cloudinary.uploadPreset)
  cloudinaryForm.append('api_key', config.cloudinary.apiKey)

  if (folder) {
    cloudinaryForm.append('folder', `${config.cloudinary.uploadPreset}/${folder}`)
  }

  const url = `https://api.cloudinary.com/v1_1/${config.cloudinary.cloudName}/image/upload`

  const response: any = await $fetch(url, {
    method: 'POST',
    body: cloudinaryForm
  })

  if (fullPath) {
    return { url: response.secure_url }
  }

  return {
    url: response.secure_url,
    path: `${response.public_id}.${response.format}`
  }
})
