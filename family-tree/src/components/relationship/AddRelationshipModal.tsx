import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useTreeStore } from '@/store/useTreeStore'
import { useRelationships } from '@/hooks/useRelationships'
import { useToast } from '@/components/ui/Toast'
import type { RelationshipType } from '@/types'

interface AddRelationshipModalProps {
  open: boolean
  onClose: () => void
  treeId: string
}

export function AddRelationshipModal({ open, onClose, treeId }: AddRelationshipModalProps) {
  const { people } = useTreeStore()
  const { createRelationship } = useRelationships(treeId)
  const { toast } = useToast()

  const [form, setForm] = useState({
    personAId: '', personBId: '',
    relationshipType: 'parent_child' as RelationshipType,
    isBiological: true,
    marriedOn: '', divorcedOn: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const personOptions = [
    { value: '', label: 'Select person...' },
    ...people.map((p) => ({ value: p.id, label: p.fullName })),
  ]

  const relTypeOptions: { value: RelationshipType; label: string }[] = [
    { value: 'parent_child', label: 'Parent → Child' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'extramarital', label: 'Extramarital' },
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!form.personAId || !form.personBId) { setError('Select both people.'); return }
    if (form.personAId === form.personBId) { setError('A person cannot be related to themselves.'); return }
    setSaving(true)
    try {
      await createRelationship({
        treeId,
        personAId: form.personAId,
        personBId: form.personBId,
        relationshipType: form.relationshipType,
        isBiological: form.isBiological,
        marriedOn: form.marriedOn || null,
        divorcedOn: form.divorcedOn || null,
      })
      toast('Relationship added.')
      onClose()
      setForm({ personAId: '', personBId: '', relationshipType: 'parent_child', isBiological: true, marriedOn: '', divorcedOn: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add relationship.')
    } finally {
      setSaving(false)
    }
  }

  const isSpouseType = form.relationshipType === 'spouse' || form.relationshipType === 'extramarital'

  return (
    <Modal open={open} onClose={onClose} title="Add Relationship">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select id="personA" label="Person A" value={form.personAId}
          onChange={(e) => setForm((f) => ({ ...f, personAId: e.target.value }))}
          options={personOptions} />

        <Select id="relType" label="Relationship Type" value={form.relationshipType}
          onChange={(e) => setForm((f) => ({ ...f, relationshipType: e.target.value as RelationshipType }))}
          options={relTypeOptions} />

        <Select id="personB" label="Person B" value={form.personBId}
          onChange={(e) => setForm((f) => ({ ...f, personBId: e.target.value }))}
          options={personOptions} />

        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
          <input type="checkbox" checked={form.isBiological}
            onChange={(e) => setForm((f) => ({ ...f, isBiological: e.target.checked }))}
            className="rounded border-slate-300 text-indigo-500 focus:ring-indigo-500" />
          Biological relationship
        </label>

        {isSpouseType && (
          <div className="grid grid-cols-2 gap-3">
            <Input id="marriedOn" label="Married On" type="date" value={form.marriedOn}
              onChange={(e) => setForm((f) => ({ ...f, marriedOn: e.target.value }))} />
            <Input id="divorcedOn" label="Divorced On" type="date" value={form.divorcedOn}
              onChange={(e) => setForm((f) => ({ ...f, divorcedOn: e.target.value }))} />
          </div>
        )}

        {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>Add Relationship</Button>
        </div>
      </form>
    </Modal>
  )
}
