import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Trophy, Calendar, Globe } from 'lucide-react'
import api from '../../services/api'
import useAuthStore from '../../store/useAuthStore'
import AvatarWithAura from '../../components/ui/AvatarWithAura'

export default function RankingPage() {
  const [type, setType] = useState('global') // global | weekly
  const { user } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ['ranking', type],
    queryFn: () => api.get(`/ranking`, { params: { type, limit: 50 } }).then(r => r.data),
    refetchInterval: 60000
  })

  const ranking = data?.ranking || []
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' }
  const posColors = { 1: '#fbbf24', 2: '#9ca3af', 3: '#d97706' }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            Ranking {type === 'global' ? 'Global' : 'Semanal'} <Trophy className="text-[#fbbf24]" />
          </h1>
          <p className="text-[var(--muted)] text-sm">
            {type === 'global' ? 'Os maiores mestres de todos os tempos.' : 'Quem mais se dedicou nos últimos 7 dias.'}
          </p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 self-start">
          <button onClick={() => setType('global')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              type === 'global' ? 'bg-var-grad shadow-glow text-white' : 'text-[var(--muted)] hover:text-white'
            }`} style={type === 'global' ? { background: 'var(--grad)' } : {}}>
            <Globe size={16} /> Global
          </button>
          <button onClick={() => setType('weekly')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              type === 'weekly' ? 'bg-var-grad shadow-glow text-white' : 'text-[var(--muted)] hover:text-white'
            }`} style={type === 'weekly' ? { background: 'var(--grad)' } : {}}>
            <Calendar size={16} /> Semanal
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 w-full rounded-2xl animate-pulse bg-white/5" />)}
        </div>
      ) : (
        <>
          {ranking.length > 0 && (
            <div className="flex items-end justify-center gap-2 md:gap-6 mb-12 mt-8">
              {ranking[1] && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="flex flex-col items-center flex-1 max-w-[120px]">
                  <div className="relative mb-3">
                    <AvatarWithAura user={ranking[1]} size="lg" className="border-4 border-[#9ca3af] p-1" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#9ca3af] flex items-center justify-center text-lg z-30">🥈</div>
                  </div>
                  <div className="text-xs font-bold text-center truncate w-full mb-1">{ranking[1].name}</div>
                  <div className="text-[10px] text-[var(--muted)] uppercase font-bold">{ranking[1].xp} XP</div>
                </motion.div>
              )}

              {ranking[0] && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center flex-1 max-w-[140px] -mt-8">
                  <div className="relative mb-3 scale-110">
                    <AvatarWithAura user={ranking[0]} size="lg" className="border-4 border-[#fbbf24] p-1 shadow-glow-gold" />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#fbbf24] flex items-center justify-center text-xl shadow-lg z-30">🥇</div>
                  </div>
                  <div className="text-sm font-bold text-center truncate w-full mb-1 text-[#fbbf24]">{ranking[0].name}</div>
                  <div className="text-[11px] text-[#fbbf24] uppercase font-black">{ranking[0].xp} XP</div>
                </motion.div>
              )}

              {ranking[2] && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="flex flex-col items-center flex-1 max-w-[120px]">
                  <div className="relative mb-3">
                    <AvatarWithAura user={ranking[2]} size="lg" className="border-4 border-[#d97706] p-1" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#d97706] flex items-center justify-center text-lg z-30">🥉</div>
                  </div>
                  <div className="text-xs font-bold text-center truncate w-full mb-1">{ranking[2].name}</div>
                  <div className="text-[10px] text-[var(--muted)] uppercase font-bold">{ranking[2].xp} XP</div>
                </motion.div>
              )}
            </div>
          )}

          <div className="rounded-2xl overflow-hidden glass border border-white/10">
            {ranking.map((u, i) => {
              const isMe = u.id === user?.id
              const pos = i + 1
              return (
                <motion.div key={u.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className={`flex items-center gap-4 px-6 py-4 border-b last:border-0 border-white/5 transition-colors ${
                    isMe ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}>
                  <span className="font-display text-lg font-bold w-6 text-center flex-shrink-0"
                    style={{ color: posColors[pos] || 'var(--muted)' }}>
                    {medals[pos] || pos}
                  </span>
                  <AvatarWithAura user={u} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold truncate ${isMe ? 'text-[var(--purple-l)]' : ''}`}>
                      {u.name} {isMe && <span className="text-[10px] bg-var-grad text-white px-1.5 py-0.5 rounded ml-1" style={{ background: 'var(--grad)' }}>VOCÊ</span>}
                    </div>
                    <div className="text-[11px] text-[var(--muted)]">Nível {u.level} • {u.streak} dias 🔥</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-base font-bold text-[#a78bfa]">{u.xp.toLocaleString('pt-BR')} XP</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
