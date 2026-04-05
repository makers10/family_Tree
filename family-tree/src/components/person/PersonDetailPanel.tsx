import { useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { useTreeStore } from '@/store/useTreeStore'
import { usePeople } from '@/hooks/usePeople'
import { uploadToCloudinary, validateImageFile } from '@/lib/cloudinary'
import { useToast } from '@/components/ui/Toast'
import { X, Edit2, Trash2, Upload, Calendar, User } from 'lucide-react'

interface PersonDetailPanelProps {
  personId: string | null
  onClose: () => void
  treeId: string
}

export function PersonDetailPanel({ personId, onClose, treeId }: PersonDetailPanelProps) {
  const { people, relationships } = useTreeStore()
  const { updatePerson, deletePerson } = usePeople(treeId)
  const { toast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const person = people.find((p) => p.id === personId)

  const relatedPeople = relationships
    .filter((r) => r.personAId === personId || r.personBId === personId)
    .map((r) => {
      const otherId = r.personAId === personId ? r.personBId : r.personAId
      const other = people.find((p) => p.id === otherId)
      return { rel: r, other }
    })
    .filter((x) => x.other)

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !person) return
    const err = validateImageFile(file)
    if (err) { toast(err, 'error'); return }
    setUploading(true)
    try {
      const { secureUrl, publicId } = await uploadToCloudinary(file)
      await updatePerson(person.id, { photoUrl: secureUrl, cloudinaryPublicId: publicId })
      toast('Photo updated.')
    } catch {
      toast('Photo upload failed.', 'error')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete() {
    if (!person || !confirm(`Delete ${person.fullName}? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await deletePerson(person.id)
      toast(`${person.fullName} removed.`)
      onClose()
    } catch {
      toast('Failed to delete person.', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const relTypeLabel: Record<string, string> = {
    parent_child: 'Parent / Child',
    spouse: 'Spouse',
    sibling: 'Sibling',
    extramarital: 'Extramarital',
  }
  const relTypeColor: Record<string, string> = {
    parent_child: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    spouse: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
    sibling: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    extramarital: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  }

  return (
    <div
      className={cn(
        'fixed right-0 top-0 h-full w-[380px] bg-white dark:bg-slate-800 shadow-2xl border-l border-slate-100 dark:border-slate-700',
        'flex flex-col z-40 animate-slide-in-right',
        !personId && 'hidden'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">Person Details</h2>
        <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label="Close panel">
          <X size={18} />
        </button>
      </div>

      {person ? (
        <div className="flex-1 overflow-y-auto">
          {/* Photo + name */}
          <div className="flex flex-col items-center gap-3 px-5 py-6 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
            <div className="relative group">
              <Avatar src={person.photoUrl} name={person.fullName} size="xl" className="w-24 h-24" />
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                aria-label="Change photo"
              >
                {uploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload size={18} />}
              </button>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoChange} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{person.fullName}</h3>
              {person.gender && (
                <span className="text-xs text-slate-400 capitalize">{person.gender}</span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="px-5 py-4 flex flex-col gap-4">
            {(person.birthDate || person.deathDate) && (
              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  {person.birthDate && <p>Born: {new Date(person.birthDate).toLocaleDateString()}</p>}
                  {person.deathDate && <p>Died: {new Date(person.deathDate).toLocaleDateString()}</p>}
                </div>
              </div>
            )}

            {person.bio && (
              <div className="flex items-start gap-3">
                <User size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{person.bio}</p>
              </div>
            )}

            {/* Relationships */}
            {relatedPeople.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Relationships</p>
                <div className="flex flex-col gap-2">
                  {relatedPeople.map(({ rel, other }) => (
                    <div key={rel.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <Avatar src={other!.photoUrl} name={other!.fullName} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{other!.fullName}</p>
                        <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-medium', relTypeColor[rel.relationshipType])}>
                          {relTypeLabel[rel.relationshipType]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400">
          Select a person to view details
        </div>
      )}

      {/* Actions */}
      {person && (
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700 flex gap-2">
          <Button variant="secondary" size="sm" className="flex-1">
            <Edit2 size={14} /> Edit
          </Button>
          <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete}>
            <Trash2 size={14} />
          </Button>
        </div>
      )}
    </div>
  )
}
