import { useState, useRef } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { usePeople } from '@/hooks/usePeople'
import { uploadToCloudinary, validateImageFile } from '@/lib/cloudinary'
import { useToast } from '@/components/ui/Toast'
import { Upload } from 'lucide-react'

interface AddPersonModalProps {
  open: boolean
  onClose: () => void
  treeId: string
}

export function AddPersonModal({ open, onClose, treeId }: AddPersonModalProps) {
  const { createPerson } = usePeople(treeId)
  const { toast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    fullName: '', birthDate: '', deathDate: '', bio: '', gender: '',
    gotra: '', nakshatra: '', rashi: '', nativeVillage: '',
  })
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const err = validateImageFile(file)
    if (err) { toast(err, 'error'); return }
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.fullName.trim()) errs.fullName = 'Full name is required.'
    if (form.birthDate && form.deathDate && form.deathDate < form.birthDate)
      errs.deathDate = 'Death date cannot be before birth date.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      let photoUrl: string | null = null
      let cloudinaryPublicId: string | null = null
      if (photoFile) {
        const result = await uploadToCloudinary(photoFile)
        photoUrl = result.secureUrl
        cloudinaryPublicId = result.publicId
      }
      await createPerson(treeId, {
        fullName: form.fullName.trim(),
        birthDate: form.birthDate || null,
        deathDate: form.deathDate || null,
        bio: form.bio || null,
        gender: (form.gender as 'male' | 'female' | 'other') || null,
        photoUrl,
        cloudinaryPublicId,
        gotra: form.gotra.trim() || null,
        nakshatra: form.nakshatra.trim() || null,
        rashi: form.rashi.trim() || null,
        nativeVillage: form.nativeVillage.trim() || null,
      })
      toast('Person added successfully.')
      onClose()
      setForm({ fullName: '', birthDate: '', deathDate: '', bio: '', gender: '', gotra: '', nakshatra: '', rashi: '', nativeVillage: '' })
      setPhotoPreview(null)
      setPhotoFile(null)
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to add person.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Person">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Photo upload */}
        <div className="flex items-center gap-4">
          <Avatar src={photoPreview} name={form.fullName} size="xl" />
          <div>
            <Button type="button" variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
              <Upload size={14} /> Upload Photo
            </Button>
            <p className="text-xs text-slate-400 mt-1">JPEG, PNG, WebP · max 5 MB</p>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
          </div>
        </div>

        <Input id="fullName" label="Full Name *" placeholder="e.g. John Smith" value={form.fullName}
          onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} error={errors.fullName} />

        <div className="grid grid-cols-2 gap-3">
          <Input id="birthDate" label="Birth Date" type="date" value={form.birthDate}
            onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value }))} />
          <Input id="deathDate" label="Death Date" type="date" value={form.deathDate}
            onChange={(e) => setForm((f) => ({ ...f, deathDate: e.target.value }))} error={errors.deathDate} />
        </div>

        <Select id="gender" label="Gender" value={form.gender}
          onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
          options={[{ value: '', label: 'Not specified' }, { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }]} />

        <Textarea id="bio" label="Bio" placeholder="A short biography..." rows={3} value={form.bio}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} />

        {/* Cultural Heritage — India-specific */}
        <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mt-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">🪔 Cultural Heritage</p>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Input id="gotra" label="Gotra" placeholder="e.g. Kashyap" value={form.gotra}
                onChange={(e) => setForm((f) => ({ ...f, gotra: e.target.value }))} />
              <Input id="nativeVillage" label="Native Village (Mool)" placeholder="e.g. Raipur" value={form.nativeVillage}
                onChange={(e) => setForm((f) => ({ ...f, nativeVillage: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Select id="nakshatra" label="Nakshatra" value={form.nakshatra}
                onChange={(e) => setForm((f) => ({ ...f, nakshatra: e.target.value }))}
                options={[
                  { value: '', label: 'Not specified' },
                  { value: 'Ashwini', label: 'Ashwini' }, { value: 'Bharani', label: 'Bharani' },
                  { value: 'Krittika', label: 'Krittika' }, { value: 'Rohini', label: 'Rohini' },
                  { value: 'Mrigashira', label: 'Mrigashira' }, { value: 'Ardra', label: 'Ardra' },
                  { value: 'Punarvasu', label: 'Punarvasu' }, { value: 'Pushya', label: 'Pushya' },
                  { value: 'Ashlesha', label: 'Ashlesha' }, { value: 'Magha', label: 'Magha' },
                  { value: 'Purva Phalguni', label: 'Purva Phalguni' }, { value: 'Uttara Phalguni', label: 'Uttara Phalguni' },
                  { value: 'Hasta', label: 'Hasta' }, { value: 'Chitra', label: 'Chitra' },
                  { value: 'Swati', label: 'Swati' }, { value: 'Vishakha', label: 'Vishakha' },
                  { value: 'Anuradha', label: 'Anuradha' }, { value: 'Jyeshtha', label: 'Jyeshtha' },
                  { value: 'Moola', label: 'Moola' }, { value: 'Purva Ashadha', label: 'Purva Ashadha' },
                  { value: 'Uttara Ashadha', label: 'Uttara Ashadha' }, { value: 'Shravana', label: 'Shravana' },
                  { value: 'Dhanishta', label: 'Dhanishta' }, { value: 'Shatabhisha', label: 'Shatabhisha' },
                  { value: 'Purva Bhadrapada', label: 'Purva Bhadrapada' }, { value: 'Uttara Bhadrapada', label: 'Uttara Bhadrapada' },
                  { value: 'Revati', label: 'Revati' },
                ]} />
              <Select id="rashi" label="Rashi (Zodiac)" value={form.rashi}
                onChange={(e) => setForm((f) => ({ ...f, rashi: e.target.value }))}
                options={[
                  { value: '', label: 'Not specified' },
                  { value: 'Mesha', label: 'Mesha (Aries)' }, { value: 'Vrishabha', label: 'Vrishabha (Taurus)' },
                  { value: 'Mithuna', label: 'Mithuna (Gemini)' }, { value: 'Karka', label: 'Karka (Cancer)' },
                  { value: 'Simha', label: 'Simha (Leo)' }, { value: 'Kanya', label: 'Kanya (Virgo)' },
                  { value: 'Tula', label: 'Tula (Libra)' }, { value: 'Vrishchika', label: 'Vrishchika (Scorpio)' },
                  { value: 'Dhanu', label: 'Dhanu (Sagittarius)' }, { value: 'Makara', label: 'Makara (Capricorn)' },
                  { value: 'Kumbha', label: 'Kumbha (Aquarius)' }, { value: 'Meena', label: 'Meena (Pisces)' },
                ]} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>Add Person</Button>
        </div>
      </form>
    </Modal>
  )
}
