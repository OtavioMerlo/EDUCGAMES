import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Trophy, Calendar, Globe, Medal, Star, Flame, Crown } from 'lucide-react'
import api from '../../services/api'
import useAuthStore from '../../store/useAuthStore'
import AvatarWithAura from '../../components/ui/AvatarWithAura'

export default function RankingPage() {
  const [type, setType] = useState('global') // global | weekly
  const { user: currentUser } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ['ranking', type],
    queryFn: () => api.get(`/ranking`, { params: { type, limit: 50 } }).then(r => r.data),
    refetchInterval: 60000
  })

  const ranking = data?.ranking || []
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' }
  const posColors = { 
    1: 'from-yellow-400 to-amber-600', 
    2: 'from-slate-300 to-slate-500', 
    3: 'from-orange-400 to-orange-700' 
  }

  const PodiumCard = ({ user, pos, delay }) => {
    const isFirst = pos === 1
    const size = isFirst ? 'lg' : 'md'
    const colorClass = posColors[pos]

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`flex flex-col items-center relative ${isFirst ? 'z-20 -mt-12' : 'z-10'}`}
      >
        {/* Crown for #1 */}
        {isFirst && (
          <motion.div
            animate={{ y: [0, -5, 0], rotate: [0, -5, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-10 z-30 drop-shadow-glow-gold"
          >
            <Crown size={32} className="text-yellow-400 fill-yellow-400" />
          </motion.div>
        )}

        {/* Podium Base */}
        <div className={`relative group p-1 rounded-full bg-gradient-to-b ${colorClass} shadow-2xl transition-transform hover:scale-105`}>
          <div className="bg-[#0f172a] rounded-full p-1 overflow-visible">
            <AvatarWithAura user={user} size={size === 'lg' ? 'xl' : 'lg'} />
          </div>
          
          {/* Rank Badge */}
          <div className={`absolute -bottom-2 -right-1 w-10 h-10 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg border-2 border-[#0f172a] z-30 font-black text-white text-lg keep-white`}>
            {pos}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 text-center w-full max-w-[140px]">
          <div className={`font-black text-sm truncate px-2 ${isFirst ? 'text-yellow-400' : 'text-[var(--text)]'}`}>
            {user.name}
          </div>
          <div className="flex items-center justify-center gap-1 mt-1">
             <div className="px-2 py-0.5 rounded-full bg-white/10 border border-white/5 text-[10px] font-bold text-purple-300 uppercase tracking-tighter">
               {user.xp.toLocaleString()} XP
             </div>
          </div>
          <div className="text-[10px] text-[var(--muted)] font-bold mt-1 uppercase">Nível {user.level}</div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-2"
          >
            <Trophy size={12} /> Hall da Fama
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-[var(--text)] tracking-tight">
            Ranking <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              {type === 'global' ? 'Global' : 'Semanal'}
            </span>
          </h1>
          <p className="text-[var(--muted)] text-sm max-w-md">
            Os guerreiros mais dedicados do reino. Suba no pódio e mostre sua aura lendária para todos!
          </p>
        </div>

        {/* Toggle Switches */}
        <div className="flex p-1.5 bg-white/5 backdrop-blur-xl rounded-2xl border border-[var(--border)] self-start">
          <button onClick={() => setType('global')}
            className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              type === 'global' ? 'text-white keep-white' : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}>
            {type === 'global' && <motion.div layoutId="tab-bg" className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20 z-0" />}
            <Globe size={14} className="relative z-10" /> <span className="relative z-10">Global</span>
          </button>
          <button onClick={() => setType('weekly')}
            className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              type === 'weekly' ? 'text-white keep-white' : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}>
            {type === 'weekly' && <motion.div layoutId="tab-bg" className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20 z-0" />}
            <Calendar size={14} className="relative z-10" /> <span className="relative z-10">Semanal</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          <div className="flex justify-center gap-8 mb-16 h-48 items-end">
             {[...Array(3)].map((_, i) => <div key={i} className="w-24 h-24 rounded-full bg-white/5 animate-pulse" />)}
          </div>
          {[...Array(6)].map((_, i) => <div key={i} className="h-20 w-full rounded-2xl animate-pulse bg-white/5" />)}
        </div>
      ) : (
        <div className="space-y-16">
          {/* Podium Area */}
          {ranking.length > 0 && (
            <div className="grid grid-cols-3 items-end gap-2 md:gap-8 pt-10 pb-4 max-w-2xl mx-auto px-4">
              {/* #2 */}
              {ranking[1] ? <PodiumCard user={ranking[1]} pos={2} delay={0.2} /> : <div />}
              {/* #1 */}
              {ranking[0] ? <PodiumCard user={ranking[0]} pos={1} delay={0.1} /> : <div />}
              {/* #3 */}
              {ranking[2] ? <PodiumCard user={ranking[2]} pos={3} delay={0.3} /> : <div />}
            </div>
          )}

          {/* List Area */}
          <div className="relative">
            {/* List Header */}
            <div className="grid grid-cols-[60px_1fr_120px] px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20">
              <span>Pos</span>
              <span>Guerreiro</span>
              <span className="text-right">Experiência</span>
            </div>

            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {ranking.map((u, i) => {
                  const isMe = u.id === currentUser?.id
                  const pos = i + 1

                  return (
                    <motion.div 
                      key={u.id} 
                      layout
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`group relative grid grid-cols-[60px_1fr_120px] items-center gap-4 px-6 py-4 rounded-3xl border transition-all duration-300 ${
                        isMe 
                        ? 'bg-purple-600/10 border-purple-500/30 shadow-lg shadow-purple-500/5' 
                        : 'bg-slate-900/30 border-white/5 hover:bg-slate-800/40 hover:border-white/10'
                      }`}
                    >
                      {/* Rank Number */}
                      <div className="flex items-center justify-center">
                        <span className={`text-lg font-black italic tracking-tighter ${
                          pos === 1 ? 'text-yellow-400' : pos === 2 ? 'text-slate-300' : pos === 3 ? 'text-orange-500' : 'text-white/20'
                        }`}>
                          #{pos}
                        </span>
                      </div>

                      {/* User Info */}
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="relative">
                           <AvatarWithAura user={u} size="md" />
                           {u.streak >= 7 && (
                             <div className="absolute -top-1 -left-1 text-[10px] drop-shadow-glow-orange">🔥</div>
                           )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-black truncate ${isMe ? 'text-white' : 'text-white/80'}`}>
                              {u.name}
                            </span>
                            {isMe && (
                              <span className="px-1.5 py-0.5 rounded bg-purple-500 text-[8px] font-black text-white uppercase">Você</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-white/30">
                            <span>Nível {u.level}</span>
                            <span className="w-1 h-1 rounded-full bg-white/10" />
                            <span className="flex items-center gap-0.5"><Flame size={10} className="text-orange-500" /> {u.streak}d</span>
                          </div>
                        </div>
                      </div>

                      {/* XP */}
                      <div className="text-right">
                        <div className={`text-sm font-black italic tracking-tight ${isMe ? 'text-purple-400' : 'text-indigo-400'}`}>
                          {u.xp.toLocaleString()} <span className="text-[10px] opacity-50 not-italic ml-0.5">XP</span>
                        </div>
                      </div>

                      {/* Glow for Top 3 in list */}
                      {pos <= 3 && (
                         <div className={`absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border-2 blur-sm ${
                           pos === 1 ? 'border-yellow-400/20' : pos === 2 ? 'border-slate-300/20' : 'border-orange-500/20'
                         }`} />
                      )}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
