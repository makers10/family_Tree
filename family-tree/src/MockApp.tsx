import { useState } from 'react'
import { MOCK_TREES, MOCK_PEOPLE, MOCK_RELATIONSHIPS, CURRENT_USER_ID } from './lib/mockData'
import type { Person, FamilyTree, PrivacyLevel } from './types'
import { FamilyTreeLogo } from './components/ui/Logo'

type Page = 'login' | 'trees' | 'tree'

const EDGE_COLORS: Record<string, string> = {
  parent_child: '#6366f1',
  spouse: '#ec4899',
  sibling: '#22c55e',
  extramarital: '#f97316',
}

const EDGE_DASH: Record<string, string> = {
  parent_child: 'none',
  spouse: '8,3',
  sibling: '4,4',
  extramarital: '2,4',
}

const REL_LABELS: Record<string, string> = {
  parent_child: 'Parent / Child',
  spouse: 'Spouse',
  sibling: 'Sibling',
  extramarital: 'Extramarital',
}

const GENDER_GRADIENT: Record<string, string> = {
  male: 'linear-gradient(135deg,#3b82f6,#6366f1)',
  female: 'linear-gradient(135deg,#ec4899,#f43f5e)',
  other: 'linear-gradient(135deg,#8b5cf6,#a855f7)',
}

const PRIVACY_CONFIG: Record<PrivacyLevel, { icon: string; label: string; color: string; desc: string }> = {
  public:            { icon: '🌐', label: 'Public',            color: '#22c55e', desc: 'Anyone can view this' },
  contributors_only: { icon: '👥', label: 'Contributors Only', color: '#f59e0b', desc: 'Only invited members' },
  private:           { icon: '🔒', label: 'Private',           color: '#ef4444', desc: 'Only you can see this' },
}

// Check if current user can view a tree
function canViewTree(tree: FamilyTree): boolean {
  if (tree.ownerId === CURRENT_USER_ID) return true
  if (tree.privacyLevel === 'public') return true
  if (tree.privacyLevel === 'contributors_only') return tree.allowedViewers?.includes(CURRENT_USER_ID) ?? false
  return false
}

// Check if current user can view a person
function canViewPerson(person: Person, isOwner: boolean): boolean {
  if (isOwner) return true
  if (person.privacyLevel === 'public') return true
  if (person.privacyLevel === 'contributors_only') return true // simplified for demo
  return false // private
}

/* ─── Shared Components ─────────────────────────────────────────────────── */

function Avatar({ name, photo, size = 48, gender }: { name: string; photo?: string | null; size?: number; gender?: string | null }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const bg = gender ? (GENDER_GRADIENT[gender] ?? 'linear-gradient(135deg,#6366f1,#ec4899)') : 'linear-gradient(135deg,#6366f1,#ec4899)'
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: 800, fontSize: size * 0.32,
      flexShrink: 0, overflow: 'hidden',
      boxShadow: `0 4px 12px rgba(99,102,241,0.3)`,
      border: '2px solid rgba(255,255,255,0.8)',
    }}>
      {photo ? <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
    </div>
  )
}

function GlassCard({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: 24,
      border: '1px solid rgba(255,255,255,0.9)',
      boxShadow: '0 8px 32px rgba(99,102,241,0.12), 0 2px 8px rgba(0,0,0,0.06)',
      ...style
    }}>
      {children}
    </div>
  )
}

function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
      background: color + '18', color, border: `1.5px solid ${color}30`,
      letterSpacing: 0.3,
    }}>{label}</span>
  )
}

function IconBtn({ icon, onClick, title }: { icon: string; onClick?: () => void; title?: string }) {
  const [hover, setHover] = useState(false)
  return (
    <button title={title} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: 38, height: 38, borderRadius: 10, border: '1px solid rgba(226,232,240,0.8)',
        background: hover ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.9)',
        cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s', color: hover ? '#6366f1' : '#64748b',
        backdropFilter: 'blur(8px)',
      }}>{icon}</button>
  )
}

function PrimaryBtn({ label, icon, onClick, small }: { label: string; icon?: string; onClick?: () => void; small?: boolean }) {
  const [hover, setHover] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        height: small ? 36 : 44, padding: small ? '0 16px' : '0 22px',
        borderRadius: small ? 10 : 12, border: 'none',
        background: hover ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
        color: 'white', fontWeight: 700, fontSize: small ? 13 : 14, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 6,
        boxShadow: hover ? '0 8px 24px rgba(99,102,241,0.45)' : '0 4px 14px rgba(99,102,241,0.35)',
        transition: 'all 0.15s', transform: hover ? 'translateY(-1px)' : 'none',
        fontFamily: 'inherit',
      }}>
      {icon && <span>{icon}</span>}{label}
    </button>
  )
}

function SecondaryBtn({ label, icon, onClick }: { label: string; icon?: string; onClick?: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        height: 36, padding: '0 16px', borderRadius: 10,
        border: '1.5px solid rgba(99,102,241,0.25)',
        background: hover ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.9)',
        color: hover ? '#6366f1' : '#475569', fontWeight: 600, fontSize: 13, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
        fontFamily: 'inherit', backdropFilter: 'blur(8px)',
      }}>
      {icon && <span>{icon}</span>}{label}
    </button>
  )
}

function StyledInput({ label, type = 'text', placeholder }: { label: string; type?: string; placeholder?: string }) {
  const [focus, setFocus] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', letterSpacing: 0.5, textTransform: 'uppercase' }}>{label}</label>
      <input type={type} placeholder={placeholder}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          height: 46, borderRadius: 12, fontFamily: 'inherit',
          border: `2px solid ${focus ? '#6366f1' : 'rgba(226,232,240,0.8)'}`,
          padding: '0 14px', fontSize: 14, outline: 'none',
          background: focus ? 'rgba(99,102,241,0.03)' : 'rgba(248,250,252,0.8)',
          transition: 'all 0.15s', color: '#0f172a',
          boxShadow: focus ? '0 0 0 4px rgba(99,102,241,0.1)' : 'none',
        }} />
    </div>
  )
}

function StyledSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', letterSpacing: 0.5, textTransform: 'uppercase' }}>{label}</label>
      <select style={{
        height: 46, borderRadius: 12, fontFamily: 'inherit',
        border: '2px solid rgba(226,232,240,0.8)', padding: '0 14px',
        fontSize: 14, outline: 'none', background: 'rgba(248,250,252,0.8)',
        color: '#0f172a', cursor: 'pointer',
      }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  )
}

/* ─── Login Page ─────────────────────────────────────────────────────────── */

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', fontFamily: 'Inter,system-ui,sans-serif',
      background: 'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Animated blobs */}
      {[
        { top: '-10%', left: '-5%', size: 500, color: 'rgba(99,102,241,0.25)' },
        { top: '60%', right: '-10%', size: 400, color: 'rgba(236,72,153,0.2)' },
        { top: '30%', left: '40%', size: 300, color: 'rgba(139,92,246,0.15)' },
      ].map((b, i) => (
        <div key={i} style={{
          position: 'absolute', width: b.size, height: b.size, borderRadius: '50%',
          background: b.color, filter: 'blur(80px)',
          top: b.top, left: (b as any).left, right: (b as any).right,
          animation: `float${i} ${6 + i * 2}s ease-in-out infinite alternate`,
        }} />
      ))}

      {/* Left panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px 80px', color: 'white', position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}>
          <FamilyTreeLogo size={48} />
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>FamilyTree</span>
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, margin: '0 0 20px', letterSpacing: -1.5 }}>
          Connect every<br />
          <span style={{ background: 'linear-gradient(135deg,#a78bfa,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            generation
          </span>
        </h1>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 420, margin: '0 0 48px' }}>
          Map your roots, honour your ancestors, and share your family story — across every branch, every generation.
        </p>
        <div style={{ display: 'flex', gap: 32 }}>
          {[['👨‍👩‍👧‍👦', 'Multi-generation trees'], ['📸', 'Photo profiles'], ['🔐', 'Privacy controls'], ['🌐', 'Shareable trees']].map(([icon, text]) => (
            <div key={text as string} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 40, position: 'relative', zIndex: 1,
      }}>
        <GlassCard style={{ width: '100%', padding: 40 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
            {tab === 'login' ? 'Sign in to your tree' : 'Start your family tree'}
          </h2>
          <p style={{ color: '#64748b', margin: '0 0 28px', fontSize: 14 }}>
            {tab === 'login' ? 'Welcome back — your family is waiting' : 'Create an account and begin mapping your roots'}
          </p>

          {/* Tabs */}
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 14, padding: 4, marginBottom: 28 }}>
            {(['login', 'register'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: '10px 0', borderRadius: 11, border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: 14, transition: 'all 0.2s', fontFamily: 'inherit',
                background: tab === t ? 'white' : 'transparent',
                color: tab === t ? '#6366f1' : '#94a3b8',
                boxShadow: tab === t ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              }}>{t === 'login' ? '🔑 Sign In' : '✨ Register'}</button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <StyledInput label="Email Address" type="email" placeholder="you@example.com" />
            <StyledInput label="Password" type="password" placeholder="••••••••" />
            {tab === 'register' && <StyledInput label="Confirm Password" type="password" placeholder="••••••••" />}

            <button onClick={onLogin} style={{
              height: 50, borderRadius: 14, border: 'none', marginTop: 4,
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: 'white', fontWeight: 800, fontSize: 15, cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(99,102,241,0.4)', fontFamily: 'inherit',
              transition: 'all 0.15s', letterSpacing: 0.3,
            }}
              onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'translateY(-2px)'; (e.target as HTMLElement).style.boxShadow = '0 12px 32px rgba(99,102,241,0.5)' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'none'; (e.target as HTMLElement).style.boxShadow = '0 8px 24px rgba(99,102,241,0.4)' }}>
              {tab === 'login' ? '→ Sign In' : '→ Create Account'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {[['🔵', 'Google'], ['⚫', 'GitHub'], ['🔷', 'Facebook']].map(([icon, name]) => (
              <button key={name as string} style={{
                flex: 1, height: 42, borderRadius: 11, border: '1.5px solid #e2e8f0',
                background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                fontFamily: 'inherit', color: '#374151', transition: 'all 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#6366f1')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#e2e8f0')}>
                {icon} {name}
              </button>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#94a3b8' }}>
            🔒 Demo mode — connect Supabase for real auth
          </p>
        </GlassCard>
      </div>
    </div>
  )
}

/* ─── Tree List Page ─────────────────────────────────────────────────────── */

function TreeListPage({ onSelectTree, onSignOut }: { onSelectTree: (id: string) => void; onSignOut: () => void }) {
  const [showCreate, setShowCreate] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [trees, setTrees] = useState(MOCK_TREES)
  const [privacyModal, setPrivacyModal] = useState<string | null>(null)

  const isOwner = (tree: FamilyTree) => tree.ownerId === CURRENT_USER_ID

  function setPrivacy(treeId: string, level: PrivacyLevel) {
    setTrees(prev => prev.map(t => t.id === treeId ? { ...t, privacyLevel: level, isPublic: level === 'public' } : t))
    setPrivacyModal(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#f0f4ff 0%,#fdf2f8 50%,#f0fdf4 100%)', fontFamily: 'Inter,system-ui,sans-serif' }}>
      {/* Navbar */}
      <nav style={{
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(226,232,240,0.8)', padding: '0 32px',
        height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 1px 20px rgba(99,102,241,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <FamilyTreeLogo size={40} />
          <span style={{ fontWeight: 900, fontSize: 20, color: '#0f172a', letterSpacing: -0.5 }}>FamilyTree</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 14px', borderRadius: 40, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <Avatar name="Demo User" size={28} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>demo@example.com</span>
          </div>
          <button onClick={onSignOut} style={{
            padding: '8px 16px', borderRadius: 10, border: '1.5px solid rgba(226,232,240,0.8)',
            background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#64748b',
            fontFamily: 'inherit', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { (e.currentTarget.style.borderColor = '#ef4444'); (e.currentTarget.style.color = '#ef4444') }}
            onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(226,232,240,0.8)'); (e.currentTarget.style.color = '#64748b') }}>
            Sign Out
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px' }}>
        {/* Hero */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 14px', borderRadius: 20, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: 14 }}>
                <span style={{ fontSize: 12 }}>🌿</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', letterSpacing: 0.5 }}>YOUR FAMILY TREES</span>
              </div>
              <h1 style={{ fontSize: 38, fontWeight: 900, color: '#0f172a', margin: '0 0 10px', letterSpacing: -1 }}>My Family Trees</h1>
              <p style={{ color: '#64748b', margin: 0, fontSize: 16 }}>Every branch tells a story — explore yours</p>
            </div>
            <PrimaryBtn label="New Tree" icon="＋" onClick={() => setShowCreate(true)} />
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 36 }}>
          {[
            { icon: '🌳', label: 'Trees', value: MOCK_TREES.length },
            { icon: '👥', label: 'People', value: MOCK_PEOPLE.length },
            { icon: '🔗', label: 'Relationships', value: MOCK_RELATIONSHIPS.length },
            { icon: '🌐', label: 'Public Trees', value: MOCK_TREES.filter(t => t.isPublic).length },
          ].map(stat => (
            <GlassCard key={stat.label} style={{ flex: 1, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{stat.icon}</div>
              <div>
                <p style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1 }}>{stat.value}</p>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: '3px 0 0', fontWeight: 600 }}>{stat.label}</p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Tree cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 20 }}>
          {trees.map(tree => {
            const accessible = canViewTree(tree)
            const owner = isOwner(tree)
            const privacy = PRIVACY_CONFIG[tree.privacyLevel ?? 'private']
            return (
            <div key={tree.id}
              onMouseEnter={() => setHoveredId(tree.id)} onMouseLeave={() => setHoveredId(null)}
              style={{
                background: accessible ? 'white' : 'rgba(248,250,252,0.7)',
                borderRadius: 22, border: `1px solid ${accessible ? 'rgba(226,232,240,0.8)' : 'rgba(239,68,68,0.2)'}`,
                padding: 26, transition: 'all 0.2s',
                boxShadow: hoveredId === tree.id && accessible ? '0 20px 48px rgba(99,102,241,0.18)' : '0 2px 12px rgba(0,0,0,0.06)',
                transform: hoveredId === tree.id && accessible ? 'translateY(-4px)' : 'none',
                position: 'relative', overflow: 'hidden',
                cursor: accessible ? 'pointer' : 'default',
                opacity: accessible ? 1 : 0.75,
              }}
              onClick={() => accessible && onSelectTree(tree.id)}>

              {/* Locked overlay */}
              {!accessible && (
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 22,
                  background: 'rgba(15,23,42,0.04)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  zIndex: 10, backdropFilter: 'blur(2px)',
                }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🔒</div>
                  <p style={{ fontWeight: 800, color: '#ef4444', margin: '0 0 4px', fontSize: 15 }}>Private Tree</p>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>You don't have access</p>
                </div>
              )}

              <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(236,72,153,0.06))', pointerEvents: 'none' }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: accessible ? 'linear-gradient(135deg,#6366f1,#ec4899)' : 'linear-gradient(135deg,#94a3b8,#cbd5e1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: accessible ? '0 4px 14px rgba(99,102,241,0.35)' : 'none' }}>
                  {accessible ? <FamilyTreeLogo size={36} /> : '🔒'}
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <Pill label={`${privacy.icon} ${privacy.label}`} color={privacy.color} />
                  {owner && (
                    <button onClick={(e) => { e.stopPropagation(); setPrivacyModal(tree.id) }} style={{
                      width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(226,232,240,0.8)',
                      background: 'white', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s',
                    }} title="Change privacy settings"
                      onMouseEnter={e => (e.currentTarget.style.borderColor = '#6366f1')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(226,232,240,0.8)')}>⚙️</button>
                  )}
                </div>
              </div>

              <h3 style={{ fontWeight: 800, fontSize: 18, color: accessible ? '#0f172a' : '#94a3b8', margin: '0 0 8px', letterSpacing: -0.3 }}>{tree.name}</h3>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 6px' }}>Created {new Date(tree.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p style={{ fontSize: 12, color: privacy.color, margin: '0 0 14px', fontWeight: 600 }}>{privacy.desc}</p>

              {accessible && (
                <>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[['👥', `${MOCK_PEOPLE.length} people`], ['🔗', `${MOCK_RELATIONSHIPS.length} links`]].map(([icon, text]) => (
                      <div key={text as string} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8, background: '#f8fafc', fontSize: 12, fontWeight: 600, color: '#64748b' }}>
                        <span>{icon}</span><span>{text}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex' }}>
                      {MOCK_PEOPLE.slice(0, 4).map((p, i) => (
                        <div key={p.id} style={{ marginLeft: i > 0 ? -8 : 0, zIndex: 4 - i }}>
                          <Avatar name={p.fullName} size={28} gender={p.gender} />
                        </div>
                      ))}
                      {MOCK_PEOPLE.length > 4 && <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f1f5f9', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#64748b', marginLeft: -8 }}>+{MOCK_PEOPLE.length - 4}</div>}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#6366f1' }}>Open →</span>
                  </div>
                </>
              )}
            </div>
            )
          })}

          {/* Add new card */}
          <div onClick={() => setShowCreate(true)}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#6366f1'; (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.03)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(226,232,240,0.8)'; (e.currentTarget as HTMLElement).style.background = 'white' }}
            style={{
              background: 'white', borderRadius: 22, border: '2px dashed rgba(226,232,240,0.8)',
              padding: 26, cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: 200, gap: 12,
            }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>＋</div>
            <p style={{ fontWeight: 700, color: '#6366f1', margin: 0, fontSize: 15 }}>Create New Tree</p>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: 13 }}>Start a new family history</p>
          </div>
        </div>
      </main>

      {/* Create Modal */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <GlassCard style={{ width: 440, padding: 36 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h2 style={{ margin: 0, fontWeight: 900, fontSize: 22, color: '#0f172a' }}>🌳 Create New Tree</h2>
              <button onClick={() => setShowCreate(false)} style={{ border: 'none', background: 'rgba(241,245,249,0.8)', cursor: 'pointer', fontSize: 16, width: 32, height: 32, borderRadius: 8, color: '#64748b' }}>✕</button>
            </div>
            <StyledInput label="Tree Name" placeholder="e.g. The Smith Family" />
            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Privacy</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(Object.entries(PRIVACY_CONFIG) as [PrivacyLevel, typeof PRIVACY_CONFIG[PrivacyLevel]][]).map(([level, cfg]) => (
                  <button key={level} style={{ flex: 1, padding: '10px 8px', borderRadius: 12, border: `2px solid ${level === 'private' ? cfg.color : 'rgba(226,232,240,0.8)'}`, background: level === 'private' ? cfg.color + '10' : 'white', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{cfg.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#374151' }}>{cfg.label}</div>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
              <SecondaryBtn label="Cancel" onClick={() => setShowCreate(false)} />
              <PrimaryBtn label="Create Tree" icon="🌳" onClick={() => setShowCreate(false)} small />
            </div>
          </GlassCard>
        </div>
      )}

      {/* Privacy Settings Modal */}
      {privacyModal && (() => {
        const tree = trees.find(t => t.id === privacyModal)!
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
            <GlassCard style={{ width: 460, padding: 36 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h2 style={{ margin: 0, fontWeight: 900, fontSize: 22, color: '#0f172a' }}>🔐 Privacy Settings</h2>
                <button onClick={() => setPrivacyModal(null)} style={{ border: 'none', background: 'rgba(241,245,249,0.8)', cursor: 'pointer', fontSize: 16, width: 34, height: 34, borderRadius: 9, color: '#64748b' }}>✕</button>
              </div>
              <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 24px' }}>Control who can see <strong>{tree.name}</strong></p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(Object.entries(PRIVACY_CONFIG) as [PrivacyLevel, typeof PRIVACY_CONFIG[PrivacyLevel]][]).map(([level, cfg]) => (
                  <button key={level} onClick={() => setPrivacy(tree.id, level)} style={{
                    padding: '16px 18px', borderRadius: 14, border: `2px solid ${tree.privacyLevel === level ? cfg.color : 'rgba(226,232,240,0.8)'}`,
                    background: tree.privacyLevel === level ? cfg.color + '10' : 'white',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'inherit',
                    boxShadow: tree.privacyLevel === level ? `0 4px 14px ${cfg.color}25` : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: cfg.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{cfg.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>{cfg.label}</span>
                          {tree.privacyLevel === level && <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: cfg.color, color: 'white' }}>Active</span>}
                        </div>
                        <p style={{ fontSize: 13, color: '#64748b', margin: '3px 0 0' }}>{cfg.desc}</p>
                      </div>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${tree.privacyLevel === level ? cfg.color : '#e2e8f0'}`, background: tree.privacyLevel === level ? cfg.color : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {tree.privacyLevel === level && <span style={{ fontSize: 10, color: 'white' }}>✓</span>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 20, padding: '14px 16px', borderRadius: 12, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <p style={{ fontSize: 12, color: '#92400e', margin: 0, fontWeight: 600 }}>⚠️ Privacy changes take effect immediately.</p>
              </div>
            </GlassCard>
          </div>
        )
      })()}
    </div>
  )
}


/* ─── Person Node ────────────────────────────────────────────────────────── */

function PersonNode({ person, onClick, selected, isOwner }: { person: Person; onClick: () => void; selected: boolean; isOwner: boolean }) {
  const [hover, setHover] = useState(false)
  const visible = canViewPerson(person, isOwner)
  const genderBorder = person.gender === 'male' ? '#3b82f6' : person.gender === 'female' ? '#ec4899' : '#8b5cf6'
  const privacy = PRIVACY_CONFIG[person.privacyLevel ?? 'public']

  if (!visible) {
    return (
      <div style={{
        background: 'rgba(248,250,252,0.8)', borderRadius: 20, width: 160,
        border: '2px dashed rgba(239,68,68,0.3)', padding: '14px 12px', textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
        <p style={{ fontWeight: 700, fontSize: 12, color: '#94a3b8', margin: 0 }}>Private Profile</p>
        <p style={{ fontSize: 11, color: '#cbd5e1', margin: '3px 0 0' }}>Access restricted</p>
      </div>
    )
  }

  return (
    <div onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: 'white', borderRadius: 20, width: 160,
        border: `2px solid ${selected ? '#6366f1' : hover ? genderBorder : 'rgba(226,232,240,0.8)'}`,
        padding: '14px 12px', cursor: 'pointer', textAlign: 'center',
        boxShadow: selected
          ? '0 0 0 4px rgba(99,102,241,0.2), 0 8px 24px rgba(99,102,241,0.2)'
          : hover ? '0 8px 24px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.07)',
        transition: 'all 0.2s',
        transform: hover || selected ? 'translateY(-3px)' : 'none',
        position: 'relative',
      }}>
      {selected && (
        <div style={{ position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderRadius: '50%', background: '#6366f1', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 8, color: 'white' }}>✓</span>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <Avatar name={person.fullName} photo={person.photoUrl} size={60} gender={person.gender} />
      </div>
      <p style={{ fontWeight: 800, fontSize: 13, color: '#0f172a', margin: '0 0 3px', lineHeight: 1.3 }}>{person.fullName}</p>
      {person.birthDate && (
        <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 500 }}>
          {new Date(person.birthDate).getFullYear()}
          {person.deathDate ? ` – ${new Date(person.deathDate).getFullYear()}` : ''}
        </p>
      )}
      {person.gender && (
        <div style={{ marginTop: 6, display: 'flex', justifyContent: 'center', gap: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: genderBorder + '15', color: genderBorder, textTransform: 'capitalize' }}>{person.gender}</span>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 10, background: privacy.color + '15', color: privacy.color }}>{privacy.icon}</span>
        </div>
      )}
    </div>
  )
}

/* ─── Tree Page ──────────────────────────────────────────────────────────── */

function TreePage({ treeId, onBack }: { treeId: string; onBack: () => void }) {
  const tree = MOCK_TREES.find(t => t.id === treeId)!
  const isOwner = tree.ownerId === CURRENT_USER_ID
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showAddPerson, setShowAddPerson] = useState(false)
  const [showAddRel, setShowAddRel] = useState(false)
  const selected = MOCK_PEOPLE.find(p => p.id === selectedId)

  const relatedPeople = selectedId ? MOCK_RELATIONSHIPS
    .filter(r => r.personAId === selectedId || r.personBId === selectedId)
    .map(r => {
      const otherId = r.personAId === selectedId ? r.personBId : r.personAId
      return { rel: r, other: MOCK_PEOPLE.find(p => p.id === otherId) }
    }).filter(x => x.other) : []

  const generations = [
    { label: 'Generation I', people: MOCK_PEOPLE.filter(p => ['p1', 'p2'].includes(p.id)) },
    { label: 'Generation II', people: MOCK_PEOPLE.filter(p => ['p3', 'p4', 'p7'].includes(p.id)) },
    { label: 'Generation III', people: MOCK_PEOPLE.filter(p => ['p5', 'p6'].includes(p.id)) },
  ]

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter,system-ui,sans-serif', background: 'linear-gradient(160deg,#f0f4ff 0%,#fdf2f8 60%,#f0fdf4 100%)' }}>

      {/* Toolbar */}
      <header style={{
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(226,232,240,0.8)', padding: '0 24px',
        height: 64, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
        boxShadow: '0 2px 20px rgba(99,102,241,0.08)', zIndex: 50,
      }}>
        <button onClick={onBack} style={{
          width: 38, height: 38, borderRadius: 10, border: '1.5px solid rgba(226,232,240,0.8)',
          background: 'white', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#64748b', transition: 'all 0.15s',
        }}
          onMouseEnter={e => { (e.currentTarget.style.borderColor = '#6366f1'); (e.currentTarget.style.color = '#6366f1') }}
          onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(226,232,240,0.8)'); (e.currentTarget.style.color = '#64748b') }}>←</button>

        <div style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0 }}>
          <FamilyTreeLogo size={32} />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 800, fontSize: 17, color: '#0f172a', letterSpacing: -0.3 }}>{tree.name}</span>
          <span style={{ marginLeft: 10, fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{MOCK_PEOPLE.length} people · {MOCK_RELATIONSHIPS.length} relationships</span>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <SecondaryBtn label="Relationship" icon="🔗" onClick={() => setShowAddRel(true)} />
          <PrimaryBtn label="Add Person" icon="＋" onClick={() => setShowAddPerson(true)} small />
          <IconBtn icon="📤" title="Share" />
          <IconBtn icon="📸" title="Export snapshot" />
          <IconBtn icon="⚙️" title="Settings" />
        </div>
      </header>

      {/* Legend bar */}
      <div style={{
        background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(226,232,240,0.6)', padding: '8px 24px',
        display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: 1, textTransform: 'uppercase' }}>Legend</span>
        {Object.entries(EDGE_COLORS).map(([type, color]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <svg width="32" height="10">
              <line x1="0" y1="5" x2="32" y2="5" stroke={color} strokeWidth="2.5"
                strokeDasharray={EDGE_DASH[type] === 'none' ? undefined : EDGE_DASH[type]}
                strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{REL_LABELS[type]}</span>
          </div>
        ))}
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Canvas */}
        <div style={{ flex: 1, overflow: 'auto', padding: '48px 60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>

          {generations.map((gen, gi) => (
            <div key={gen.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              {/* Generation label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, width: '100%', maxWidth: 700 }}>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.2))' }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: 1.5, textTransform: 'uppercase', padding: '4px 14px', borderRadius: 20, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>{gen.label}</span>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(99,102,241,0.2),transparent)' }} />
              </div>

              {/* People row */}
              <div style={{ display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                {gen.people.map((p, pi) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    <PersonNode person={p} onClick={() => setSelectedId(p.id === selectedId ? null : p.id)} selected={selectedId === p.id} isOwner={isOwner} />
                    {/* Spouse connector */}
                    {pi < gen.people.length - 1 && MOCK_RELATIONSHIPS.some(r =>
                      (r.personAId === p.id || r.personBId === p.id) &&
                      (r.personAId === gen.people[pi + 1].id || r.personBId === gen.people[pi + 1].id) &&
                      (r.relationshipType === 'spouse' || r.relationshipType === 'extramarital')
                    ) && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 4px' }}>
                        <svg width="40" height="20">
                          <line x1="0" y1="10" x2="40" y2="10"
                            stroke={MOCK_RELATIONSHIPS.find(r =>
                              (r.personAId === p.id || r.personBId === p.id) &&
                              (r.personAId === gen.people[pi + 1].id || r.personBId === gen.people[pi + 1].id)
                            )?.relationshipType === 'extramarital' ? '#f97316' : '#ec4899'}
                            strokeWidth="2.5" strokeDasharray="8,3" strokeLinecap="round" />
                          <text x="20" y="8" textAnchor="middle" fontSize="10" fill="#ec4899">♥</text>
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Connector to next gen */}
              {gi < generations.length - 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '4px 0' }}>
                  <div style={{ width: 2, height: 32, background: 'linear-gradient(180deg,#6366f1,rgba(99,102,241,0.3))', borderRadius: 2 }} />
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 0 3px rgba(99,102,241,0.2)' }} />
                  <div style={{ width: 2, height: 16, background: 'rgba(99,102,241,0.3)', borderRadius: 2 }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        <div style={{
          width: selected ? 360 : 0, overflow: 'hidden', transition: 'width 0.3s ease',
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(226,232,240,0.8)', flexShrink: 0,
          boxShadow: selected ? '-8px 0 32px rgba(99,102,241,0.1)' : 'none',
        }}>
          {selected && (
            <div style={{ width: 360, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(226,232,240,0.8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>Person Details</span>
                <button onClick={() => setSelectedId(null)} style={{ border: 'none', background: 'rgba(241,245,249,0.8)', cursor: 'pointer', fontSize: 14, width: 30, height: 30, borderRadius: 8, color: '#64748b' }}>✕</button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {/* Hero section */}
                <div style={{ padding: '32px 22px 24px', background: 'linear-gradient(180deg,rgba(99,102,241,0.05),transparent)', textAlign: 'center', borderBottom: '1px solid rgba(241,245,249,0.8)' }}>
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: 14 }}>
                    <Avatar name={selected.fullName} photo={selected.photoUrl} size={88} gender={selected.gender} />
                    <button style={{
                      position: 'absolute', bottom: 0, right: 0, width: 28, height: 28,
                      borderRadius: '50%', border: '2px solid white', background: '#6366f1',
                      cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                    }}>📷</button>
                  </div>
                  <h3 style={{ fontWeight: 900, fontSize: 20, margin: '0 0 6px', color: '#0f172a', letterSpacing: -0.5 }}>{selected.fullName}</h3>
                  {selected.gender && <Pill label={selected.gender.charAt(0).toUpperCase() + selected.gender.slice(1)} color={selected.gender === 'male' ? '#3b82f6' : selected.gender === 'female' ? '#ec4899' : '#8b5cf6'} />}
                </div>

                <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {/* Dates */}
                  {(selected.birthDate || selected.deathDate) && (
                    <div style={{ padding: '14px 16px', borderRadius: 14, background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)' }}>
                      <p style={{ fontSize: 11, fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 10px' }}>📅 Life Dates</p>
                      {selected.birthDate && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#374151', marginBottom: 4 }}><span style={{ fontWeight: 600 }}>Born</span><span>{new Date(selected.birthDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>}
                      {selected.deathDate && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#374151' }}><span style={{ fontWeight: 600 }}>Died</span><span>{new Date(selected.deathDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>}
                    </div>
                  )}

                  {/* Bio */}
                  {selected.bio && (
                    <div style={{ padding: '14px 16px', borderRadius: 14, background: 'rgba(236,72,153,0.04)', border: '1px solid rgba(236,72,153,0.1)' }}>
                      <p style={{ fontSize: 11, fontWeight: 800, color: '#ec4899', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px' }}>👤 Biography</p>
                      <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.7 }}>{selected.bio}</p>
                    </div>
                  )}

                  {/* Relationships */}
                  {relatedPeople.length > 0 && (
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 12px' }}>🔗 Relationships</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {relatedPeople.map(({ rel, other }) => (
                          <div key={rel.id} style={{
                            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                            borderRadius: 14, background: 'white', border: '1px solid rgba(226,232,240,0.8)',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                          }}>
                            <Avatar name={other!.fullName} size={36} gender={other!.gender} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontWeight: 700, fontSize: 13, margin: '0 0 3px', color: '#0f172a' }}>{other!.fullName}</p>
                              <Pill label={REL_LABELS[rel.relationshipType]} color={EDGE_COLORS[rel.relationshipType]} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ padding: '16px 22px', borderTop: '1px solid rgba(226,232,240,0.8)', display: 'flex', gap: 8 }}>
                {isOwner && (
                  <div style={{ flex: 1, display: 'flex', gap: 6 }}>
                    {(Object.entries(PRIVACY_CONFIG) as [PrivacyLevel, typeof PRIVACY_CONFIG[PrivacyLevel]][]).map(([level, cfg]) => (
                      <button key={level} title={cfg.label} style={{
                        flex: 1, height: 34, borderRadius: 9,
                        border: `2px solid ${selected.privacyLevel === level ? cfg.color : 'rgba(226,232,240,0.8)'}`,
                        background: selected.privacyLevel === level ? cfg.color + '15' : 'white',
                        cursor: 'pointer', fontSize: 14, fontFamily: 'inherit',
                        color: selected.privacyLevel === level ? cfg.color : '#94a3b8',
                        fontWeight: 700, transition: 'all 0.15s',
                      }}>{cfg.icon}</button>
                    ))}
                  </div>
                )}
                <button style={{ height: 38, padding: '0 14px', borderRadius: 10, border: '1.5px solid rgba(99,102,241,0.25)', background: 'rgba(99,102,241,0.06)', cursor: 'pointer', fontWeight: 700, fontSize: 13, color: '#6366f1', fontFamily: 'inherit' }}>✏️</button>
                <button style={{ height: 38, padding: '0 14px', borderRadius: 10, border: 'none', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}>🗑️</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Person Modal */}
      {showAddPerson && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <GlassCard style={{ width: 480, padding: 36, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontWeight: 900, fontSize: 22, color: '#0f172a' }}>Add Family Member</h2>
              <button onClick={() => setShowAddPerson(false)} style={{ border: 'none', background: 'rgba(241,245,249,0.8)', cursor: 'pointer', fontSize: 16, width: 34, height: 34, borderRadius: 9, color: '#64748b' }}>✕</button>
            </div>

            {/* Photo upload */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 20px', borderRadius: 16, background: 'linear-gradient(135deg,rgba(99,102,241,0.06),rgba(236,72,153,0.04))', border: '1px solid rgba(99,102,241,0.12)', marginBottom: 22 }}>
              <Avatar name="New" size={72} />
              <div>
                <button style={{ padding: '8px 16px', borderRadius: 10, border: '1.5px solid rgba(99,102,241,0.3)', background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#6366f1', fontFamily: 'inherit' }}>📷 Upload Photo</button>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: '6px 0 0', fontWeight: 500 }}>JPEG, PNG, WebP · max 5 MB</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <StyledInput label="Full Name *" placeholder="e.g. John Smith" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <StyledInput label="Birth Date" type="date" />
                <StyledInput label="Death Date" type="date" />
              </div>
              <StyledSelect label="Gender" options={['Not specified', 'Male', 'Female', 'Other']} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', letterSpacing: 0.5, textTransform: 'uppercase' }}>Biography</label>
                <textarea rows={3} placeholder="A short biography..." style={{ borderRadius: 12, border: '2px solid rgba(226,232,240,0.8)', padding: '12px 14px', fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'inherit', background: 'rgba(248,250,252,0.8)', color: '#0f172a' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
              <SecondaryBtn label="Cancel" onClick={() => setShowAddPerson(false)} />
              <PrimaryBtn label="Add Person" icon="✓" onClick={() => setShowAddPerson(false)} small />
            </div>
          </GlassCard>
        </div>
      )}

      {/* Add Relationship Modal */}
      {showAddRel && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <GlassCard style={{ width: 440, padding: 36 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontWeight: 900, fontSize: 22, color: '#0f172a' }}>🔗 Add Relationship</h2>
              <button onClick={() => setShowAddRel(false)} style={{ border: 'none', background: 'rgba(241,245,249,0.8)', cursor: 'pointer', fontSize: 16, width: 34, height: 34, borderRadius: 9, color: '#64748b' }}>✕</button>
            </div>

            {/* Relationship type pills */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Relationship Type</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {Object.entries(REL_LABELS).map(([type, label]) => (
                  <button key={type} style={{
                    padding: '7px 14px', borderRadius: 20, border: `2px solid ${EDGE_COLORS[type]}40`,
                    background: `${EDGE_COLORS[type]}12`, color: EDGE_COLORS[type],
                    fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { (e.currentTarget.style.background = EDGE_COLORS[type] + '25' ) }}
                    onMouseLeave={e => { (e.currentTarget.style.background = EDGE_COLORS[type] + '12' ) }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <StyledSelect label="Person A" options={['Select person...', ...MOCK_PEOPLE.map(p => p.fullName)]} />
              <StyledSelect label="Person B" options={['Select person...', ...MOCK_PEOPLE.map(p => p.fullName)]} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <StyledInput label="Married On" type="date" />
                <StyledInput label="Divorced On" type="date" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
              <SecondaryBtn label="Cancel" onClick={() => setShowAddRel(false)} />
              <PrimaryBtn label="Add Relationship" icon="✓" onClick={() => setShowAddRel(false)} small />
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}

/* ─── Root ───────────────────────────────────────────────────────────────── */

export function MockApp() {
  const [page, setPage] = useState<Page>('login')
  const [treeId, setTreeId] = useState('tree-1')

  if (page === 'login') return <LoginPage onLogin={() => setPage('trees')} />
  if (page === 'trees') return <TreeListPage onSelectTree={(id) => { setTreeId(id); setPage('tree') }} onSignOut={() => setPage('login')} />
  return <TreePage treeId={treeId} onBack={() => setPage('trees')} />
}
