import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { CheckCircle, XCircle, X } from 'lucide-react'

type ToastType = 'success' | 'error'
interface Toast { id: number; message: string; type: ToastType }

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  let counter = 0

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++counter
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [counter])

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto animate-scale-in',
              t.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
            )}
          >
            {t.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
            <span>{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="ml-1 opacity-60 hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
