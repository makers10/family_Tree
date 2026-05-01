import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { cn } from '@/lib/cn'
import { Avatar } from '@/components/ui/Avatar'
import type { PersonNodeData } from '@/types'

export const PersonNode = memo(({ data, selected }: NodeProps<PersonNodeData>) => {
  const genderColors: Record<string, string> = {
    male: 'border-blue-400 dark:border-blue-500',
    female: 'border-pink-400 dark:border-pink-500',
    other: 'border-purple-400 dark:border-purple-500',
  }
  const borderColor = data.gender ? genderColors[data.gender] : 'border-slate-200 dark:border-slate-600'

  return (
    <div
      className={cn(
        'relative flex flex-col items-center gap-2 px-3 py-3 rounded-2xl border-2 bg-white shadow-md cursor-pointer',
        'dark:bg-slate-800 dark:text-slate-100',
        'transition-all duration-150 hover:shadow-xl hover:-translate-y-0.5',
        'w-[160px]',
        borderColor,
        selected && 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900'
      )}
      role="button"
      aria-label={data.fullName}
    >
      <Handle type="target" position={Position.Top} className="!bg-indigo-400 !w-2 !h-2 !border-0" />

      <Avatar src={data.photoUrl} name={data.fullName} size="lg" />

      <div className="text-center w-full">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate leading-tight">
          {data.fullName}
        </p>
        {(data.birthDate || data.deathDate) && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {data.birthDate ? new Date(data.birthDate).getFullYear() : '?'}
            {data.deathDate ? ` – ${new Date(data.deathDate).getFullYear()}` : ''}
          </p>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-indigo-400 !w-2 !h-2 !border-0" />
    </div>
  )
})
PersonNode.displayName = 'PersonNode'
