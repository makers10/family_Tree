import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTrees } from '@/hooks/useTrees'
import { usePeople } from '@/hooks/usePeople'
import { useRelationships } from '@/hooks/useRelationships'
import { useTreeStore } from '@/store/useTreeStore'
import { FamilyTreeCanvas } from '@/components/tree/FamilyTreeCanvas'
import { PersonDetailPanel } from '@/components/person/PersonDetailPanel'
import { AddPersonModal } from '@/components/person/AddPersonModal'
import { AddRelationshipModal } from '@/components/relationship/AddRelationshipModal'
import { InviteModal } from '@/components/tree/InviteModal'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { ArrowLeft, UserPlus, Link2, Share2, Trees, Moon, Sun, UserCheck } from 'lucide-react'

export function TreePage() {
  const { treeId } = useParams<{ treeId: string }>()
  const navigate = useNavigate()
  const { trees } = useTrees()
  const { toast } = useToast()
  const canvasRef = useRef<HTMLDivElement | null>(null)

  usePeople(treeId)
  useRelationships(treeId)

  const { currentTree, people } = useTreeStore()
  const tree = trees.find((t) => t.id === treeId) ?? currentTree

  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null)
  const [showAddPerson, setShowAddPerson] = useState(false)
  const [showAddRel, setShowAddRel] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  function toggleDark() {
    setDarkMode((d) => !d)
    document.documentElement.classList.toggle('dark')
  }

  async function handleShare() {
    const url = `${window.location.origin}/trees/${treeId}/public`
    try {
      await navigator.clipboard.writeText(url)
      toast('Share link copied to clipboard.')
    } catch {
      toast('Share link: ' + url)
    }
  }

  if (!treeId) return null

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Toolbar */}
      <header className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 z-30 flex-shrink-0">
        <button
          onClick={() => navigate('/trees')}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Back to trees"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <Trees size={14} className="text-white" />
          </div>
          <h1 className="font-semibold text-slate-900 dark:text-white truncate">
            {tree?.name ?? 'Family Tree'}
          </h1>
          <span className="text-xs text-slate-400 flex-shrink-0">{people.length} people</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowInvite(true)} className="hidden sm:flex border-emerald-200 dark:border-emerald-900/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            <UserCheck size={14} className="mr-1" /> Invite
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowAddRel(true)} disabled={people.length < 2}>
            <Link2 size={14} /> <span className="hidden sm:inline">Relationship</span>
          </Button>
          <Button size="sm" onClick={() => setShowAddPerson(true)}>
            <UserPlus size={14} /> <span className="hidden sm:inline">Add Person</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 size={14} />
          </Button>
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
        <span className="font-medium">Legend:</span>
        {[
          { color: '#6366f1', dash: 'none', label: 'Parent/Child' },
          { color: '#ec4899', dash: '8 3', label: 'Spouse' },
          { color: '#22c55e', dash: '4 4', label: 'Sibling' },
          { color: '#f97316', dash: '2 4', label: 'Extramarital' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <svg width="24" height="8">
              <line x1="0" y1="4" x2="24" y2="4" stroke={item.color} strokeWidth="2"
                strokeDasharray={item.dash === 'none' ? undefined : item.dash} />
            </svg>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Canvas + Detail Panel */}
      <div className="flex flex-1 overflow-hidden relative">
        <FamilyTreeCanvas
          onNodeClick={setSelectedPersonId}
          canvasRef={canvasRef}
        />
        <PersonDetailPanel
          personId={selectedPersonId}
          onClose={() => setSelectedPersonId(null)}
          treeId={treeId}
        />
      </div>

      {/* Modals */}
      <AddPersonModal open={showAddPerson} onClose={() => setShowAddPerson(false)} treeId={treeId} />
      <AddRelationshipModal open={showAddRel} onClose={() => setShowAddRel(false)} treeId={treeId} />
      {tree && (
        <InviteModal 
          open={showInvite} 
          onClose={() => setShowInvite(false)} 
          treeName={tree.name} 
          inviteToken={tree.inviteToken} 
        />
      )}
    </div>
  )
}
