import { useState } from 'react'
import { Share2, Copy, Check, MessageCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

interface InviteModalProps {
  open: boolean
  onClose: () => void
  treeName: string
  inviteToken: string
}

export function InviteModal({ open, onClose, treeName, inviteToken }: InviteModalProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  if (!open) return null

  const inviteUrl = `${window.location.origin}/join/${inviteToken}`
  const whatsappMessage = `Hi! I'm building our family tree on Vanshavali. Join the ${treeName} family tree here: ${inviteUrl}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast('Invitation link copied!')
    } catch (err) {
      toast('Failed to copy link.')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-up">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-500" /> Invite Family
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl mb-6">
            <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed">
              Anyone with this link can join and edit the <strong>{treeName}</strong> family tree. Share it with your siblings, parents, and cousins!
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              className="w-full h-12 bg-[#25D366] hover:bg-[#20bd5c] text-white border-none flex items-center justify-center gap-2 text-lg rounded-xl"
              onClick={() => window.open(whatsappUrl, '_blank')}
            >
              <MessageCircle className="w-6 h-6 fill-current" /> Share on WhatsApp
            </Button>

            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <span className="text-slate-400 text-xs">Link</span>
              </div>
              <input 
                readOnly 
                value={inviteUrl}
                className="w-full pl-12 pr-12 h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-400 focus:outline-none"
              />
              <button 
                onClick={handleCopy}
                className="absolute right-2 top-1.5 p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
              >
                {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Privacy Tip: Only share this link with trusted family members.
          </p>
        </div>
      </div>
    </div>
  )
}
