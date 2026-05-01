import { Check, Sparkles, X, Trees, Download, Camera, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface UpgradeModalProps {
  open: boolean
  onClose: () => void
  reason?: 'limit' | 'feature'
}

export function UpgradeModal({ open, onClose, reason = 'limit' }: UpgradeModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-indigo-100 dark:border-indigo-900/30 overflow-hidden animate-slide-up relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 z-10">
          <X size={24} />
        </button>

        {/* Header with Background Pattern */}
        <div className="relative h-40 bg-gradient-to-br from-indigo-600 to-pink-600 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
          </div>
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md mb-3">
              <Sparkles className="text-white w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">Upgrade to Family Plan</h2>
          </div>
        </div>

        <div className="p-8">
          {reason === 'limit' && (
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl mb-8 border border-amber-100 dark:border-amber-800/30">
              <p className="text-sm text-amber-800 dark:text-amber-300 font-medium flex items-center gap-2">
                <span>⚠️</span> You've reached the free limit of 10 people.
              </p>
            </div>
          )}

          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Unlock the full power of your lineage:</h3>

          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            {[
              { icon: <Trees className="w-5 h-5 text-emerald-500" />, label: "Up to 100 members", desc: "Grow your tree without limits" },
              { icon: <Download className="w-5 h-5 text-indigo-500" />, label: "PDF & Image Export", desc: "Print and frame your tree" },
              { icon: <Camera className="w-5 h-5 text-pink-500" />, label: "Photo Uploads", desc: "Save memories forever" },
              { icon: <Share2 className="w-5 h-5 text-amber-500" />, label: "Priority Support", desc: "Help whenever you need it" },
            ].map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex-shrink-0 mt-1">{item.icon}</div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">{item.label}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <Button size="lg" className="w-full h-14 rounded-2xl text-lg shadow-xl shadow-indigo-500/25 bg-gradient-to-r from-indigo-600 to-indigo-500 border-none">
              Upgrade for ₹149/month
            </Button>
            <p className="text-center text-xs text-slate-400">
              Secure payments via Razorpay. Cancel anytime.
            </p>
          </div>
        </div>

        <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Trusted by 1000+ families</span>
          </div>
          <button onClick={onClose} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}
