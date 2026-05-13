import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, Flame } from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import api from '../../services/api'
import AvatarWithAura from '../../components/ui/AvatarWithAura'
import { formatCompact } from '../../utils/format'

// New balanced XP formula
const xpForLevel = (l) => Math.floor(100 + Math.pow(l - 1, 2) * 2.5)

function XpCard({ user }) {
  const level = user?.level || 1
  const xp = user?.xp || 0
  
  // Total XP needed to reach the START of the current level
  const totalXpToReachLevel = (lvl) => {
    let total = 0
    for (let i = 1; i < lvl; i++) {
      total += xpForLevel(i)
    }
    return total
  }

  const startOfLevelXp = totalXpToReachLevel(level)
  const currentLevelProgress = Math.max(0, xp - startOfLevelXp)
  const requiredForNextLevel = xpForLevel(level)
  
  const pct = Math.min(100, Math.round((currentLevelProgress / requiredForNextLevel) * 100))
  const remaining = Math.max(0, requiredForNextLevel - currentLevelProgress)

  return (
    <div className="relative overflow-hidden rounded-2xl p-6 mb-5"
      style={{ background: 'linear-gradient(135deg,rgba(124,58,237,.2),rgba(236,72,153,.1))', border: '1px solid rgba(168,85,247,.3)' }}>
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(168,85,247,.15),transparent 70%)', transform: 'translate(30%,-40%)' }}/>
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 shadow-glow"
            style={{ background: 'var(--grad)' }}>
            <span className="text-[9px] font-bold opacity-80 uppercase tracking-wider keep-white">nível</span>
            <span className="font-display text-2xl font-bold leading-none keep-white">{level}</span>
          </div>
          <div className="flex-1">
            <div className="text-[11px] text-[var(--muted)] uppercase tracking-wider mb-2">Experiência Total: {xp.toLocaleString('pt-BR')} XP</div>
            <div className="flex items-baseline gap-1.5 mb-2.5">
              <span className="font-display text-3xl font-bold text-[var(--text)]">{currentLevelProgress.toLocaleString('pt-BR')}</span>
              <span className="text-[var(--muted)] text-sm">/ {requiredForNextLevel.toLocaleString('pt-BR')} XP</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden bg-white/5 border border-white/5">
              <motion.div className="xp-bar-fill" style={{ height: '100%', borderRadius: 4 }}
                initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: 'easeOut' }}/>
            </div>
            <p className="text-[11px] text-[var(--muted)] mt-1.5">
              ✨ Faltam <span className="text-[var(--purple-l)] font-bold">{remaining} XP</span> para o nível {level + 1}!
            </p>
          </div>
        </div>
        <div className="text-xs text-[var(--muted)]">{pct}% do nível {level} concluído</div>
      </div>
    </div>
  )
}

function StatCard({ icon, value, label, color }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col items-center p-4 rounded-xl text-center cursor-default transition-all"
      style={{ background: 'var(--inp)', border: '1px solid var(--border)' }}>
      <div className="text-2xl mb-1.5">{icon}</div>
      <div className="font-display text-xl font-bold leading-none mb-1" style={{ color }}>{value}</div>
      <div className="text-[11px] text-[var(--muted)]">{label}</div>
    </motion.div>
  )
}

function MissionCard({ mission }) {
  const um = mission
  const m = mission.mission
  const pct = Math.min(100, Math.round((um.progress / m.targetValue) * 100))

  return (
    <div className={`flex items-center gap-3.5 p-4 rounded-xl ${um.completed ? 'opacity-60' : ''}`}
      style={{ background: 'var(--inp)', border: '1px solid var(--border)' }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: 'var(--inp)', border: '1px solid var(--border)' }}>{m.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm mb-0.5 text-[var(--text)]">{m.title}</div>
        <div className="text-xs text-[var(--muted)] mb-2">{m.description}</div>
        <div className="h-1.5 rounded-full overflow-hidden bg-[var(--inp)] border border-[var(--border)]">
          <motion.div className="h-full rounded-full" style={{ background: um.completed ? '#10b981' : 'var(--grad)' }}
            initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}/>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-xs font-bold text-[#a78bfa]">+{m.xpReward} XP</span>
        <span className="text-xs text-[var(--muted)]">{um.progress}/{m.targetValue}</span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuthStore()

  const { data: freshUser } = useQuery({ 
    queryKey: ['me'], 
    queryFn: () => api.get('/auth/me').then(r => r.data),
    refetchInterval: 10000
  })
  
  const { data: missions } = useQuery({ 
    queryKey: ['missions'], 
    queryFn: () => api.get('/missions').then(r => r.data) 
  })
  
  const { data: rankingData } = useQuery({ 
    queryKey: ['ranking-preview'], 
    queryFn: () => api.get('/ranking?limit=5').then(r => r.data) 
  })

  const currentUser = freshUser || user
  const activeMissions = (missions || []).filter(m => !m.completed).slice(0, 3)

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <motion.div 
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-2xl p-2 border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-2xl"
          >
            <img src="/logo.png" alt="EducaGames" className="w-full h-full object-contain filter drop-shadow-lg" />
          </motion.div>
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-0.5">
              Olá, <span className="grad-text">{currentUser?.name?.split(' ')[0]}</span>! 👋
            </h1>
            <p className="text-[var(--muted)] text-sm">Seu progresso é salvo automaticamente no banco de dados.</p>
          </div>
        </div>
      </div>

      <XpCard user={currentUser} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon="🔥" value={formatCompact(currentUser?.streak || 0)} label="dias de streak" color="#f472b6" />
        <StatCard icon="🎯" value={(missions || []).filter(m => !m.completed).length} label="missões ativas" color="#a78bfa" />
        <StatCard icon="🏆" value={rankingData?.myRank?.rank ? `#${rankingData.myRank.rank}` : '–'} label="no ranking" color="#fbbf24" />
        <StatCard icon="🪙" value={formatCompact(currentUser?.coins || 0)} label="moedas" color="#fbbf24" />
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        <div>
          <h2 className="font-display text-lg font-bold mb-3">Missões Diárias</h2>
          <div className="flex flex-col gap-2.5 mb-6">
            {activeMissions.length > 0 ? activeMissions.map(m => <MissionCard key={m.id} mission={m} />) : 
              <div className="p-8 text-center glass rounded-2xl text-[var(--muted)]">🎉 Todas as missões de hoje concluídas!</div>
            }
          </div>
          
          <h2 className="font-display text-lg font-bold mb-3">Atividades sugeridas</h2>
          <Link to="/activities" className="block p-5 rounded-2xl glass border-dashed hover:border-[var(--purple-l)] transition-all text-center">
            <div className="text-2xl mb-2">📚</div>
            <div className="font-bold">Ver catálogo de atividades</div>
            <p className="text-xs text-[var(--muted)]">Filtre por matéria e ganhe mais XP</p>
          </Link>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold mb-3">Top 5 Global</h2>
          <div className="glass rounded-2xl p-4">
            {(rankingData?.ranking || []).map((u, i) => (
              <div key={u.id} className="flex items-center gap-3 py-2.5 border-b last:border-0 border-white/5">
                <span className="font-display font-bold w-4 text-[var(--muted)]">{i + 1}</span>
                <AvatarWithAura user={u} size="xs" />
                <div className="flex-1 truncate text-sm">{u.name}</div>
                <div className="text-[11px] font-bold text-[#a78bfa]">{u.xp} XP</div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 rounded-2xl bg-[#f472b6]/10 border border-[#f472b6]/20">
            <div className="flex items-center gap-2 mb-1 text-[#f472b6]">
              <Flame size={16}/>
              <span className="font-bold text-xs uppercase tracking-wider">Foco Total</span>
            </div>
            <div className="font-display text-2xl font-bold">{currentUser?.streak} dias seguidos</div>
          </div>
        </div>
      </div>
    </div>
  )
}
