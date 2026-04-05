import { cn } from '@/lib/cn'
import { User } from 'lucide-react'

interface AvatarProps {
  src?: string | null
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base', xl: 'w-20 h-20 text-xl' }

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const initials = name
    ? name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : null

  return (
    <div className={cn('rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-400 to-pink-400 text-white font-semibold flex-shrink-0', sizes[size], className)}>
      {src ? (
        <img src={src} alt={name ?? 'Person'} className="w-full h-full object-cover" />
      ) : initials ? (
        <span>{initials}</span>
      ) : (
        <User size={size === 'sm' ? 14 : size === 'md' ? 18 : 24} />
      )}
    </div>
  )
}
