import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn, signUp } from '@/hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const navigate = useNavigate()
  const { toast } = useToast()

  function validate() {
    const errs: typeof errors = {}
    if (!email.includes('@')) errs.email = 'Enter a valid email.'
    if (password.length < 8) errs.password = 'Password must be at least 8 characters.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      if (mode === 'register') {
        await signUp(email, password)
        toast('Account created! Check your email to confirm.')
      } else {
        await signIn(email, password)
        navigate('/trees')
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Authentication failed.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 shadow-lg mb-4">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.728 12.728.707.707M1 12h1m20 0h1M4.22 19.78l.707-.707M18.95 5.05l.707-.707" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Family Tree</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Build your family legacy</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">
          {/* Tabs */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-700 p-1 mb-6">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                  mode === m
                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input id="email" label="Email" type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} autoComplete="email" />
            <Input id="password" label="Password" type="password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
