import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={cn(
          'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 transition-colors appearance-none',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
          'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100',
          error && 'border-red-400 focus:ring-red-400',
          className
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
)
Select.displayName = 'Select'
