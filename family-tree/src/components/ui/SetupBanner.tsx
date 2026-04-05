import { isSupabaseConfigured } from '@/lib/supabase'

export function SetupBanner() {
  if (isSupabaseConfigured) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] bg-amber-500 text-amber-950 px-4 py-2 text-sm font-medium flex items-center justify-center gap-2">
      <span>⚠️</span>
      <span>
        Supabase is not configured. Add your credentials to{' '}
        <code className="bg-amber-400 px-1 rounded font-mono">family-tree/.env</code>{' '}
        and restart the dev server.
      </span>
    </div>
  )
}
