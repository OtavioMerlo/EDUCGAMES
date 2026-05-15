import { useState, useCallback, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, Users, Zap, Flame, Trophy, ChevronRight, X } from 'lucide-react'
import api from '../../services/api'
import useAuthStore from '../../store/useAuthStore'
import AvatarWithAura, { AURAS } from '../../components/ui/AvatarWithAura'
import { RankBadge } from '../../components/ui/ProfileComponents'
import { Highlight } from '../../components/ui/Highlight'

// ── debounce hook ──────────────────────────────────────────────────────────
function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const timerRef = useRef(null)

  const setDebounced = useCallback((v) => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setDebouncedValue(v), delay)
  }, [delay])

  return [debouncedValue, setDebounced]
}

// ── Player Card ────────────────────────────────────────────────────────────
function PlayerCard({ player, index, query }) {
  const aura = player.equippedAura ? AURAS[player.equippedAura] : null
  const glowColor = aura?.glow || player.avatarColor || '#7c3aed'
  const isTop3 = player.rankPosition <= 3

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group"
    >
      <Link
        to={`/profile/${player.id}`}
        className="flex items-center gap-4 p-4 rounded-2xl glass border border-white/10 hover:border-purple-500/40 transition-all duration-200 cursor-pointer block"
        style={{
          boxShadow: isTop3 ? `0 0 24px ${glowColor}18` : 'none',
          borderColor: isTop3 ? `${glowColor}30` : undefined
        }}
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <AvatarWithAura user={player} size="md" showAccessory={true} />
          {isTop3 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
              style={{
                background: player.rankPosition === 1 ? '#fbbf24' : player.rankPosition === 2 ? '#94a3b8' : '#b45309',
                color: '#000'
              }}>
              {player.rankPosition === 1 ? '👑' : player.rankPosition === 2 ? '2' : '3'}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="font-black text-[var(--text)] truncate">
              <Highlight text={player.name} query={query} />
            </span>
            <RankBadge rank={player.rankPosition} />
          </div>
          <div className="text-[11px] text-[var(--muted)] truncate mb-2">
            <Highlight text={player.bio || 'Sem bio ainda.'} query={query} />
          </div>
          <div className="flex items-center gap-3 text-[11px] font-bold">
            <span className="flex items-center gap-1 text-purple-400">
              <Zap size={11} /> {player.xp?.toLocaleString('pt-BR')} XP
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <Trophy size={11} /> Nv. {player.level}
            </span>
            {player.streak > 0 && (
              <span className="flex items-center gap-1 text-red-400">
                <Flame size={11} /> {player.streak}d
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight size={18} className="text-[var(--muted)] group-hover:text-purple-400 transition-colors flex-shrink-0" />
      </Link>
    </motion.div>
  )
}

// ── Skeleton loader ──────────────────────────────────────────────────────
function PlayerSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl glass border border-white/10 animate-pulse">
      <div className="w-14 h-14 rounded-full bg-white/5 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/5 rounded-lg w-1/3" />
        <div className="h-3 bg-white/5 rounded-lg w-2/3" />
        <div className="h-3 bg-white/5 rounded-lg w-1/4" />
      </div>
    </div>
  )
}

// ── Top Players (top 10 ranking) ─────────────────────────────────────────
function TopPlayers() {
  const { data, isLoading } = useQuery({
    queryKey: ['ranking-top10'],
    queryFn: () => api.get('/ranking?type=global&limit=10').then(r => r.data),
    staleTime: 60_000
  })

  if (isLoading) return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => <PlayerSkeleton key={i} />)}
    </div>
  )

  const players = (data?.ranking || []).map(u => ({ ...u, rankPosition: u.rank }))

  return (
    <div className="space-y-3">
      {players.map((p, i) => <PlayerCard key={p.id} player={p} index={i} />)}
    </div>
  )
}

// ── MAIN PlayersPage ──────────────────────────────────────────────────────
export default function PlayersPage() {
  const { user: me } = useAuthStore()
  const [inputValue, setInputValue] = useState('')
  const [debouncedQ, setDebouncedQ] = useDebounce('', 400)

  const handleInput = (v) => {
    setInputValue(v)
    setDebouncedQ(v)
  }

  const { data: searchData, isLoading: isSearching, isFetching } = useQuery({
    queryKey: ['user-search', debouncedQ],
    queryFn: () => api.get(`/search/global?q=${encodeURIComponent(debouncedQ)}`).then(r => r.data),
    enabled: debouncedQ.trim().length >= 2,
    staleTime: 30_000
  })

  const searchResults = searchData?.users || []
  const isSearchMode = debouncedQ.trim().length >= 2

  return (
    <div className="max-w-2xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-black tracking-tight mb-1 flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30">
            <Users size={22} className="text-purple-400" />
          </span>
          Jogadores
        </h1>
        <p className="text-[var(--muted)] text-sm">Encontre e explore o perfil de outros jogadores</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        {/* Glow ring when active */}
        <AnimatePresence>
          {inputValue.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ boxShadow: '0 0 0 2px rgba(124,58,237,0.5), 0 0 40px rgba(124,58,237,0.15)' }}
            />
          )}
        </AnimatePresence>

        <div className="relative flex items-center">
          <Search
            size={18}
            className={`absolute left-4 z-10 transition-colors duration-200 ${inputValue ? 'text-purple-400' : 'text-[var(--muted)]'}`}
          />
          <input
            type="text"
            value={inputValue}
            onChange={e => handleInput(e.target.value)}
            placeholder="Buscar jogador pelo nome..."
            autoComplete="off"
            className="w-full glass border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-[var(--text)] text-base outline-none transition-all duration-200 placeholder:text-[var(--muted)]"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          />
          {inputValue && (
            <button
              onClick={() => handleInput('')}
              className="absolute right-4 text-[var(--muted)] hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Loading indicator */}
        <AnimatePresence>
          {isFetching && isSearchMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-12 right-12 h-0.5 rounded-full overflow-hidden"
            >
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {isSearchMode ? (
          <motion.div
            key="search-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Status */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm text-[var(--muted)] uppercase tracking-widest">
                {isSearching ? 'Buscando...' : `${searchResults.length} resultado${searchResults.length !== 1 ? 's' : ''} para "${debouncedQ}"`}
              </h2>
            </div>

            {isSearching ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <PlayerSkeleton key={i} />)}
              </div>
            ) : searchResults.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Users size={28} className="text-[var(--muted)] opacity-40" />
                </div>
                <p className="font-bold text-[var(--muted)]">Nenhum jogador encontrado</p>
                <p className="text-sm text-[var(--muted)] opacity-60 mt-1">Tente outro nome ou parte dele</p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {searchResults
                  .filter(p => p.id !== me?.id)
                  .map((player, i) => (
                    <PlayerCard key={player.id} player={player} index={i} query={debouncedQ} />
                  ))}
                {searchResults.every(p => p.id === me?.id) && (
                  <div className="text-center py-10 text-[var(--muted)] text-sm">
                    Esse é você! Tente buscar outro jogador.
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="top-players"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={16} className="text-amber-400" />
              <h2 className="font-bold text-sm text-[var(--muted)] uppercase tracking-widest">Top Jogadores</h2>
            </div>
            <TopPlayers />

            {/* Hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-4 rounded-2xl border border-dashed border-white/10 text-center"
            >
              <p className="text-sm text-[var(--muted)]">
                Digite pelo menos <span className="font-bold text-purple-400">2 caracteres</span> para buscar um jogador específico
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
