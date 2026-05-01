import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Trees, Sparkles, Loader2, ArrowRight, ShieldCheck } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export function JoinTreePage() {
  const { token } = useParams<{ token: string }>()
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [treeInfo, setTreeInfo] = useState<{ id: string; name: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    verifyToken()
  }, [token])

  async function verifyToken() {
    try {
      const { data, error } = await supabase
        .from('family_trees')
        .select('id, name')
        .eq('invite_token', token)
        .single()

      if (error || !data) {
        setError('Invalid or expired invitation link.')
        setLoading(false)
        return
      }

      setTreeInfo(data)
      setLoading(false)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  async function handleJoin() {
    if (!user) {
      // Redirect to login but save the token in session storage or URL
      navigate(`/login?join=${token}`)
      return
    }

    if (!treeInfo) return

    setLoading(true)
    try {
      // Check if already a contributor
      const { data: existing } = await supabase
        .from('tree_contributors')
        .select('id')
        .eq('tree_id', treeInfo.id)
        .eq('user_id', user.id)
        .single()

      if (existing) {
        toast('You are already a member of this tree.')
        navigate(`/trees/${treeInfo.id}`)
        return
      }

      // Add as contributor
      const { error: joinError } = await supabase
        .from('tree_contributors')
        .insert({
          tree_id: treeInfo.id,
          user_id: user.id,
          role: 'editor'
        })

      if (joinError) throw joinError

      toast(`Success! You've joined the ${treeInfo.name} tree.`)
      navigate(`/trees/${treeInfo.id}`)
    } catch (err: any) {
      toast(err.message || 'Failed to join tree.')
      setLoading(false)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-6">
          <Trees className="text-red-500 w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Invitation Error</h1>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mb-8">{error}</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    )
  }

  return (
    <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 text-center animate-slide-up">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-pink-500 mb-8 shadow-xl shadow-indigo-500/20">
          <Trees className="text-white w-10 h-10" />
        </div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles className="w-3 h-3" /> Family Invitation
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
          Join the {treeInfo?.name} Tree
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
          You've been invited to contribute to this family tree. Collaborate with your relatives to preserve your shared history.
        </p>

        <div className="space-y-4">
          <Button onClick={handleJoin} size="lg" className="w-full h-14 rounded-2xl text-lg shadow-lg shadow-indigo-500/20">
            {user ? 'Accept Invitation' : 'Sign In to Join'} <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4" /> Secure & Private Invitation
          </div>
        </div>
      </div>
    </div>
  )
}
