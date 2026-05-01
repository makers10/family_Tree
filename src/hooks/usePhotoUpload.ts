import { useState } from 'react'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { usePeople } from './usePeople'

export function usePhotoUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { updatePerson } = usePeople(undefined)

  async function uploadPhoto(personId: string, file: File): Promise<string> {
    setUploading(true)
    setError(null)
    try {
      const { secureUrl, publicId } = await uploadToCloudinary(file)
      await updatePerson(personId, { photoUrl: secureUrl, cloudinaryPublicId: publicId })
      return secureUrl
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed.'
      setError(msg)
      throw err
    } finally {
      setUploading(false)
    }
  }

  return { uploadPhoto, uploading, error }
}
