const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export interface CloudinaryUploadResult {
  secureUrl: string
  publicId: string
}

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only JPEG, PNG, and WebP images are supported.'
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Image must be smaller than 5 MB.'
  }
  return null
}

export async function uploadToCloudinary(
  file: File,
  folder = 'family-tree/people'
): Promise<CloudinaryUploadResult> {
  const error = validateImageFile(file)
  if (error) throw new Error(error)

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error?.message ?? 'Cloudinary upload failed.')
  }

  const data = await res.json()
  return { secureUrl: data.secure_url, publicId: data.public_id }
}

export async function uploadSnapshotToCloudinary(
  blob: Blob
): Promise<CloudinaryUploadResult> {
  const formData = new FormData()
  formData.append('file', blob, 'snapshot.png')
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', 'family-tree/snapshots')

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) throw new Error('Snapshot upload failed.')
  const data = await res.json()
  return { secureUrl: data.secure_url, publicId: data.public_id }
}
