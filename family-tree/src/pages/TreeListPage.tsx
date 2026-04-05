import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrees } from '@/hooks/useTrees'
import { useAuthStore } from '@/store/useAuthStore'
import { signOut } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { Plus, Trees, LogOut, Globe, Lock, Trash2 } from 'lucide-react'

export function TreeListPage() {
  const { trees, loading, createTree, deleteTree } = useTrees()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    try {
      const tree = await createTree(newName.trim())
      toast('Tree created.')
      setShowCreate(false)
      setNewName('')
      navigate(`/trees/${tree.id}`)
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to create tree.', 'error')
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await deleteTree(id)
      toast('Tree deleted.')
    } catch {
      toast('Failed to delete tree.', 'error')
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center">
            <Trees size={16} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-lg">Family Tree</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</span>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut size={14} /> Sign Out
          </Button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Family Trees</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and explore your family histories</p>
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <Plus size={16} /> New Tree
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : trees.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <Trees size={32} className="text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-slate-500 dark:text-slate-400">No trees yet. Create your first one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trees.map((tree) => (
              <div
                key={tree.id}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150"
                onClick={() => navigate(`/trees/${tree.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-pink-400 flex items-center justify-center">
                    <Trees size={18} className="text-white" />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(tree.id, tree.name) }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      aria-label="Delete tree"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{tree.name}</h3>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  {tree.isPublic ? <Globe size={12} /> : <Lock size={12} />}
                  <span>{tree.isPublic ? 'Public' : 'Private'}</span>
                  <span className="mx-1">·</span>
                  <span>{new Date(tree.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create New Tree">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input id="treeName" label="Tree Name" placeholder="e.g. The Smith Family" value={newName}
            onChange={(e) => setNewName(e.target.value)} autoFocus />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" loading={creating}>Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
