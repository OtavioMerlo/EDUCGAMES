import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import api from '../../services/api'

const RARITY = {
  COMMON: { label: 'Comum', color: '#9ca3af' },
  RARE: { label: 'Raro', color: '#60a5fa' },
  EPIC: { label: 'Épico', color: '#a78bfa' },
  LEGENDARY: { label: 'Lendário', color: '#fbbf24' },
}

export default function AchievementsPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => api.get('/achievements').then(r => r.data)
  })

  const unlocked = data.filter(a => a.unlocked).length
  const total = data.length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Conquistas 🏅</h1>
          <p className="text-[var(--muted)] text-sm mt-0.5">{unlocked}/{total} conquistadas</p>
        </div>
        <div className="px-4 py-2 rounded-full text-sm font-bold"
          style={{ background: 'rgba(124,58,237,.15)', border: '1px solid rgba(168,85,247,.3)', color: 'var(--purple-l)' }}>
          {total > 0 ? Math.round((unlocked / total) * 100) : 0}% completo
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--inp)' }}>
        <motion.div className="h-full rounded-full"
          style={{ background: 'var(--grad)' }}
          initial={{ width: 0 }}
          animate={{ width: `${total > 0 ? (unlocked / total) * 100 : 0}%` }}
          transition={{ duration: 1.2 }} />
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => <div key={i} className="h-32 rounded-xl animate-pulse" style={{ background: 'var(--inp)' }}/>)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((ach, i) => {
            const r = RARITY[ach.rarity]
            return (
              <motion.div key={ach.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className={`p-5 rounded-2xl transition-all ${!ach.unlocked ? 'opacity-50 grayscale' : ''}`}
                style={{
                  background: ach.unlocked ? 'var(--inp)' : 'rgba(255,255,255,.02)',
                  border: `1px solid ${ach.unlocked ? `${r.color}66` : 'var(--border)'}`,
                  boxShadow: ach.unlocked ? `0 0 16px ${r.color}22` : 'none'
                }}>
                <div className="text-4xl mb-3">{ach.emoji}</div>
                <div className="font-semibold text-sm mb-1">{ach.title}</div>
                <div className="text-[var(--muted)] text-xs mb-3">{ach.description}</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ color: r.color, background: `${r.color}22`, border: `1px solid ${r.color}44` }}>
                    {r.label}
                  </span>
                  {ach.unlocked
                    ? <span className="text-xs text-[#10b981]">✓ Desbloqueada</span>
                    : <span className="text-xs text-[var(--muted)]">🔒 Bloqueada</span>}
                </div>
                {ach.xpBonus > 0 && <div className="text-[11px] text-[#a78bfa] mt-1.5">+{ach.xpBonus} XP bônus</div>}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
