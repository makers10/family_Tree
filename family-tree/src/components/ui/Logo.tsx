interface LogoProps {
  size?: number
  showText?: boolean
  textColor?: string
}

export function FamilyTreeLogo({ size = 40, showText = false, textColor = '#0f172a' }: LogoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Gradient defs */}
        <defs>
          <linearGradient id="logoGrad1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="logoGrad2" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
        </defs>

        {/* Background rounded square */}
        <rect width="48" height="48" rx="14" fill="url(#logoGrad1)" />

        {/* Root person (top center) */}
        <circle cx="24" cy="10" r="4.5" fill="white" opacity="0.95" />

        {/* Trunk line down from root */}
        <line x1="24" y1="14.5" x2="24" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

        {/* Horizontal branch */}
        <line x1="12" y1="22" x2="36" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

        {/* Left branch down */}
        <line x1="12" y1="22" x2="12" y2="29" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        {/* Right branch down */}
        <line x1="36" y1="22" x2="36" y2="29" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        {/* Center branch down */}
        <line x1="24" y1="22" x2="24" y2="29" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

        {/* Gen 2 people */}
        <circle cx="12" cy="32" r="4" fill="white" opacity="0.9" />
        <circle cx="24" cy="32" r="4" fill="white" opacity="0.9" />
        <circle cx="36" cy="32" r="4" fill="white" opacity="0.9" />

        {/* Gen 2 left branch down */}
        <line x1="12" y1="36" x2="12" y2="40" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <line x1="8" y1="40" x2="16" y2="40" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="8" cy="43" r="2.5" fill="white" opacity="0.7" />
        <circle cx="16" cy="43" r="2.5" fill="white" opacity="0.7" />

        {/* Gen 2 right branch down */}
        <line x1="36" y1="36" x2="36" y2="40" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <line x1="32" y1="40" x2="40" y2="40" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="32" cy="43" r="2.5" fill="white" opacity="0.7" />
        <circle cx="40" cy="43" r="2.5" fill="white" opacity="0.7" />
      </svg>

      {showText && (
        <span style={{ fontWeight: 900, fontSize: size * 0.45, color: textColor, letterSpacing: -0.5, fontFamily: 'Inter,system-ui,sans-serif' }}>
          FamilyTree
        </span>
      )}
    </div>
  )
}

export function LogoIcon({ size = 40 }: { size?: number }) {
  return <FamilyTreeLogo size={size} />
}
