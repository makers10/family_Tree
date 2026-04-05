import { useState } from 'react'
import { MOCK_TREES, MOCK_PEOPLE, MOCK_RELATIONSHIPS } from './lib/mockData'
import type { Person } from './types'

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

function Avatar({ name, photo, size = 48 }: { name: string; photo?: string | null; size?: number }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg,#6366f1,#ec4899)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: 700, fontSize: size * 0.3,
      flexShrink: 0, overflow: 'hidden'
    }}>
      {photo ? <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
    </div>
  )
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
      background: color + '22', color, border: `1px solid ${color}44`
    }}>{label}</span>
  )
}

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg,#eef2ff 0%,#fdf2f8 50%,#f0fdf4 100%)',
      fontFamily: 'Inter,system-ui,sans-serif', padding: 16
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'linear-gradient(135deg,#6366f1,#ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: 32, boxShadow: '0 8px 32px #6366f140'
          }}>🌳</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Family Tree</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Build your family legacy across generations</p>
        </div>
        <div style={{
          background: 'white', borderRadius: 24, padding: 36,
          boxShadow: '0 20px 60px rgba(99,102,241,0.12)', border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {(['login', 'register'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: '9px 0', borderRadius: 9, border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: 14, transition: 'all 0.15s',
                background: tab === t ? 'white' : 'transparent',
                color: tab === t ? '#0f172a' : '#64748b',
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'
              }}>{t === 'login' ? 'Sign In' : 'Register'}</button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input type="email" placeholder="Email address" style={{
              height: 46, borderRadius: 10, border: '1.5px solid #e2e8f0', padding: '0 14px',
              fontSize: 14, outline: 'none', fontFamily: 'inherit', transition: 'border 0.15s'
            }} onFocus={e => (e.target.style.borderColor = '#6366f1')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
            <input type="password" placeholder="Password (min 8 chars)" style={{
              height: 46, borderRadius: 10, border: '1.5px solid #e2e8f0', padding: '0 14px',
              fontSize: 14, outline: 'none', fontFamily: 'inherit'
            }} onFocus={e => (e.target.style.borderColor = '#6366f1')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
            {tab === 'register' && (
              <input type="password" placeholder="Confirm password" style={{
                height: 46, borderRadius: 10, border: '1.5px solid #e2e8f0', padding: '0 14px',
                fontSize: 14, outline: 'none', fontFamily: 'inherit'
              }} />
            )}
            <button onClick={onLogin} style={{
              height: 48, borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer',
              boxShadow: '0 4px 16px #6366f140', transition: 'transform 0.1s'
            }} onMouseDown={e => ((e.target as HTMLElement).style.transform = 'scale(0.98)')}
              onMouseUp={e => ((e.target as HTMLElement).style.transform = 'scale(1)')}>
              {tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </div>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#94a3b8' }}>
            Demo mode — connect Supabase to enable real auth
          </p>
        </div>
      </div>
    </div>
  )
}

function TreeListPage({ onSelectTree, onSignOut }: { onSelectTree: (id: string) => void; onSignOut: () => void }) {
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter,system-ui,sans-serif' }}>
      <nav style={{
        background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px',
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌳</div>
          <span style={{ fontWeight: 800, fontSize: 18, color: '#0f172a' }}>Family Tree</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name="Demo User" size={32} />
          <span style={{ fontSize: 13, color: '#64748b' }}>demo@example.com</span>
          <button onClick={onSignOut} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 13, color: '#64748b' }}>Sign Out</button>
        </div>
      </nav>
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>My Family Trees</h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>Manage and explore your family histories</p>
          </div>
          <button onClick={() => setShowCreate(true)} style={{
            height: 40, padding: '0 18px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white',
            fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
          }}>＋ New Tree</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          {MOCK_TREES.map(tree => (
            <div key={tree.id} onClick={() => onSelectTree(tree.id)} style={{
              background: 'white', borderRadius: 18, border: '1px solid #e2e8f0', padding: 22,
              cursor: 'pointer', transition: 'all 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(99,102,241,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; (e.currentTarget as HTMLElement).style.transform = 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🌳</div>
                <Badge label={tree.isPublic ? '🌐 Public' : '🔒 Private'} color={tree.isPublic ? '#22c55e' : '#6366f1'} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 16, color: '#0f172a', margin: '0 0 6px' }}>{tree.name}</h3>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Created {new Date(tree.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </main>
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ margin: '0 0 20px', fontWeight: 700 }}>Create New Tree</h2>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. The Smith Family" style={{ width: '100%', height: 44, borderRadius: 10, border: '1.5px solid #e2e8f0', padding: '0 14px', fontSize: 14, boxSizing: 'border-box', outline: 'none' }} autoFocus />
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowCreate(false)} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => setShowCreate(false)} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#6366f1', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PersonCard({ person, onClick, selected }: { person: Person; onClick: () => void; selected: boolean }) {
  const genderColor = person.gender === 'male' ? '#3b82f6' : person.gender === 'female' ? '#ec4899' : '#8b5cf6'
  return (
    <div onClick={onClick} style={{
      background: 'white', borderRadius: 16, border: `2px solid ${selected ? '#6366f1' : genderColor + '44'}`,
      padding: '12px 14px', cursor: 'pointer', minWidth: 150, maxWidth: 170, textAlign: 'center',
      boxShadow: selected ? '0 0 0 3px #6366f130' : '0 2px 8px rgba(0,0,0,0.08)',
      transition: 'all 0.15s', position: 'relative'
    }}
      onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none' }}>
      <Avatar name={person.fullName} photo={person.photoUrl} size={56} />
      <p style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', margin: '8px 0 2px', lineHeight: 1.3 }}>{person.fullName}</p>
      {person.birthDate && <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{new Date(person.birthDate).getFullYear()}{person.deathDate ? ` – ${new Date(person.deathDate).getFullYear()}` : ''}</p>}
    </div>
  )
}

function RelLegend() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      {Object.entries({ parent_child: 'Parent/Child', spouse: 'Spouse', sibling: 'Sibling', extramarital: 'Extramarital' }).map(([type, label]) => (
        <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
          <svg width="28" height="8"><line x1="0" y1="4" x2="28" y2="4" stroke={EDGE_COLORS[type]} strokeWidth="2" strokeDasharray={EDGE_DASH[type] === 'none' ? undefined : EDGE_DASH[type]} /></svg>
          {label}
        </div>
      ))}
    </div>
  )
}

function TreePage({ treeId, onBack }: { treeId: string; onBack: () => void }) {
  const tree = MOCK_TREES.find(t => t.id === treeId)!
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showAddPerson, setShowAddPerson] = useState(false)
  const [showAddRel, setShowAddRel] = useState(false)
  const selected = MOCK_PEOPLE.find(p => p.id === selectedId)

  const relTypeLabel: Record<string, string> = { parent_child: 'Parent/Child', spouse: 'Spouse', sibling: 'Sibling', extramarital: 'Extramarital' }

  const relatedPeople = selectedId ? MOCK_RELATIONSHIPS
    .filter(r => r.personAId === selectedId || r.personBId === selectedId)
    .map(r => {
      const otherId = r.personAId === selectedId ? r.personBId : r.personAId
      return { rel: r, other: MOCK_PEOPLE.find(p => p.id === otherId) }
    }).filter(x => x.other) : []

  // Simple grid layout by generation
  const gen0 = MOCK_PEOPLE.filter(p => ['p1', 'p2'].includes(p.id))
  const gen1 = MOCK_PEOPLE.filter(p => ['p3', 'p7'].includes(p.id))
  const gen1b = MOCK_PEOPLE.filter(p => ['p4'].includes(p.id))
  const gen2 = MOCK_PEOPLE.filter(p => ['p5', 'p6'].includes(p.id))

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter,system-ui,sans-serif', background: '#f8fafc' }}>
      {/* Toolbar */}
      <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 9, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 16 }}>←</button>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🌳</div>
        <span style={{ fontWeight: 700, fontSize: 16, color: '#0f172a', flex: 1 }}>{tree.name}</span>
        <span style={{ fontSize: 12, color: '#94a3b8' }}>{MOCK_PEOPLE.length} people</span>
        <button onClick={() => setShowAddRel(true)} style={{ height: 36, padding: '0 14px', borderRadius: 9, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#475569' }}>🔗 Relationship</button>
        <button onClick={() => setShowAddPerson(true)} style={{ height: 36, padding: '0 14px', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>＋ Add Person</button>
        <button style={{ height: 36, padding: '0 14px', borderRadius: 9, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 13 }}>📤 Share</button>
      </header>

      {/* Legend */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>LEGEND</span>
        <RelLegend />
      </div>

      {/* Canvas + Panel */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Tree Canvas */}
        <div style={{ flex: 1, overflow: 'auto', padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <svg style={{ position: 'absolute', pointerEvents: 'none', width: '100%', height: '100%', top: 0, left: 0 }} />

          {/* Gen 0 */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 8, alignItems: 'center' }}>
            {gen0.map(p => <PersonCard key={p.id} person={p} onClick={() => setSelectedId(p.id === selectedId ? null : p.id)} selected={selectedId === p.id} />)}
          </div>
          <div style={{ display: 'flex', gap: 80, marginBottom: 0 }}>
            {gen0.map(() => <div key="line" style={{ width: 2, height: 40, background: '#6366f1' }} />)}
          </div>

          {/* Gen 1 */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 8, alignItems: 'center' }}>
            {gen1.map(p => <PersonCard key={p.id} person={p} onClick={() => setSelectedId(p.id === selectedId ? null : p.id)} selected={selectedId === p.id} />)}
            <div style={{ width: 2, height: 56, background: '#ec4899', borderStyle: 'dashed', borderWidth: '0 0 0 2px', borderColor: '#ec4899', marginTop: 0 }} />
            {gen1b.map(p => <PersonCard key={p.id} person={p} onClick={() => setSelectedId(p.id === selectedId ? null : p.id)} selected={selectedId === p.id} />)}
          </div>
          <div style={{ display: 'flex', gap: 80, marginBottom: 0 }}>
            <div style={{ width: 2, height: 40, background: '#6366f1' }} />
          </div>

          {/* Gen 2 */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {gen2.map(p => <PersonCard key={p.id} person={p} onClick={() => setSelectedId(p.id === selectedId ? null : p.id)} selected={selectedId === p.id} />)}
          </div>

          {MOCK_PEOPLE.length === 0 && (
            <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: 80 }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🌱</div>
              <p style={{ fontWeight: 600, fontSize: 16 }}>No people yet</p>
              <p style={{ fontSize: 14 }}>Add the first person to start building your family tree.</p>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{
            width: 340, background: 'white', borderLeft: '1px solid #e2e8f0',
            display: 'flex', flexDirection: 'column', flexShrink: 0, boxShadow: '-4px 0 20px rgba(0,0,0,0.06)'
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Person Details</span>
              <button onClick={() => setSelectedId(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, color: '#94a3b8' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <div style={{ padding: '28px 20px', background: 'linear-gradient(180deg,#f8fafc,white)', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>
                <Avatar name={selected.fullName} photo={selected.photoUrl} size={80} />
                <h3 style={{ fontWeight: 800, fontSize: 18, margin: '12px 0 4px', color: '#0f172a' }}>{selected.fullName}</h3>
                {selected.gender && <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'capitalize' }}>{selected.gender}</span>}
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {(selected.birthDate || selected.deathDate) && (
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 16 }}>📅</span>
                    <div style={{ fontSize: 13, color: '#475569' }}>
                      {selected.birthDate && <p style={{ margin: '0 0 2px' }}>Born: {new Date(selected.birthDate).toLocaleDateString()}</p>}
                      {selected.deathDate && <p style={{ margin: 0 }}>Died: {new Date(selected.deathDate).toLocaleDateString()}</p>}
                    </div>
                  </div>
                )}
                {selected.bio && (
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 16 }}>👤</span>
                    <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.6 }}>{selected.bio}</p>
                  </div>
                )}
                {relatedPeople.length > 0 && (
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 10px' }}>Relationships</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {relatedPeople.map(({ rel, other }) => (
                        <div key={rel.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, background: '#f8fafc' }}>
                          <Avatar name={other!.fullName} size={32} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 600, fontSize: 13, margin: '0 0 2px', color: '#0f172a' }}>{other!.fullName}</p>
                            <Badge label={relTypeLabel[rel.relationshipType]} color={EDGE_COLORS[rel.relationshipType]} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div style={{ padding: '14px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8 }}>
              <button style={{ flex: 1, height: 36, borderRadius: 9, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>✏️ Edit</button>
              <button style={{ height: 36, padding: '0 14px', borderRadius: 9, border: 'none', background: '#fee2e2', color: '#ef4444', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>🗑️</button>
            </div>
          </div>
        )}
      </div>

      {/* Add Person Modal */}
      {showAddPerson && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, width: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontWeight: 700 }}>Add Person</h2>
              <button onClick={() => setShowAddPerson(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, color: '#94a3b8' }}>✕</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, padding: 16, background: '#f8fafc', borderRadius: 12 }}>
              <Avatar name="New Person" size={64} />
              <div>
                <button style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>📷 Upload Photo</button>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0 0' }}>JPEG, PNG, WebP · max 5 MB</p>
              </div>
            </div>
            {[['Full Name *', 'text', 'e.g. John Smith'], ['Birth Date', 'date', ''], ['Death Date', 'date', '']].map(([label, type, ph]) => (
              <div key={label as string} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>{label}</label>
                <input type={type as string} placeholder={ph as string} style={{ width: '100%', height: 42, borderRadius: 9, border: '1.5px solid #e2e8f0', padding: '0 12px', fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Gender</label>
              <select style={{ width: '100%', height: 42, borderRadius: 9, border: '1.5px solid #e2e8f0', padding: '0 12px', fontSize: 14, background: 'white', outline: 'none' }}>
                <option>Not specified</option><option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Bio</label>
              <textarea rows={3} placeholder="A short biography..." style={{ width: '100%', borderRadius: 9, border: '1.5px solid #e2e8f0', padding: '10px 12px', fontSize: 14, boxSizing: 'border-box', outline: 'none', resize: 'none', fontFamily: 'inherit' }} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAddPerson(false)} style={{ padding: '9px 18px', borderRadius: 9, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => setShowAddPerson(false)} style={{ padding: '9px 18px', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Add Person</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Relationship Modal */}
      {showAddRel && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, width: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontWeight: 700 }}>Add Relationship</h2>
              <button onClick={() => setShowAddRel(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, color: '#94a3b8' }}>✕</button>
            </div>
            {['Person A', 'Relationship Type', 'Person B'].map((label, i) => (
              <div key={label} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>{label}</label>
                <select style={{ width: '100%', height: 42, borderRadius: 9, border: '1.5px solid #e2e8f0', padding: '0 12px', fontSize: 14, background: 'white', outline: 'none' }}>
                  {i === 1
                    ? ['Parent → Child', 'Spouse', 'Sibling', 'Extramarital'].map(o => <option key={o}>{o}</option>)
                    : [<option key="">Select person...</option>, ...MOCK_PEOPLE.map(p => <option key={p.id}>{p.fullName}</option>)]}
                </select>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button onClick={() => setShowAddRel(false)} style={{ padding: '9px 18px', borderRadius: 9, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => setShowAddRel(false)} style={{ padding: '9px 18px', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function MockApp() {
  const [page, setPage] = useState<Page>('login')
  const [treeId, setTreeId] = useState<string>('tree-1')

  if (page === 'login') return <LoginPage onLogin={() => setPage('trees')} />
  if (page === 'trees') return <TreeListPage onSelectTree={(id) => { setTreeId(id); setPage('tree') }} onSignOut={() => setPage('login')} />
  return <TreePage treeId={treeId} onBack={() => setPage('trees')} />
}
