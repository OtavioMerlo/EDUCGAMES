import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, UserPlus, UserCheck, Clock, UserX, BarChart2, Trophy, Package, User } from 'lucide-react'
import api from '../../services/api'
import useAuthStore from '../../store/useAuthStore'
import toast from 'react-hot-toast'
import AvatarWithAura, { AURAS } from '../../components/ui/AvatarWithAura'
import RewardImage from '../../components/ui/RewardImage'
import { XPBar, RankBadge, StatCard, AchievementCard, ProfileBanner, ActivityFeedItem } from '../../components/ui/ProfileComponents'
import { Zap, Flame, Target, Star, Shield, CheckCircle } from 'lucide-react'

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
}

// ── Follow Button ─────────────────────────────────────────────────────────────
function FollowButton({ targetId, myId }) {
  const qc = useQueryClient()

  const { data: fs } = useQuery({
    queryKey: ['friendship-status', targetId],
    queryFn: () => api.get(`/friendships/status/${targetId}`).then(r => r.data),
    enabled: !!targetId && !!myId
  })

  const sendReq = useMutation({
    mutationFn: () => api.post('/friendships/request', { receiverId: targetId }),
    onSuccess: () => { toast.success('Pedido enviado!'); qc.invalidateQueries(['friendship-status', targetId]) },
    onError: (e) => toast.error(e?.response?.data?.error || 'Erro ao enviar pedido.')
  })

  const removeReq = useMutation({
    mutationFn: () => api.delete(`/friendships/remove/${targetId}`),
    onSuccess: () => { toast.success('Amizade removida.'); qc.invalidateQueries(['friendship-status', targetId]) },
    onError: () => toast.error('Erro ao remover amizade.')
  })

  if (!fs) return <Skeleton className="h-10 w-32" />

  if (fs.status === 'NONE') {
    return (
      <button onClick={() => sendReq.mutate()} disabled={sendReq.isPending}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all cursor-pointer">
        <UserPlus size={16} /> Adicionar Amigo
      </button>
    )
  }
  if (fs.status === 'PENDING' && fs.isSender) {
    return (
      <button onClick={() => removeReq.mutate()} disabled={removeReq.isPending}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-red-500/20 text-white/60 hover:text-red-400 font-bold text-sm transition-all cursor-pointer border border-white/10">
        <Clock size={16} /> Pedido Enviado
      </button>
    )
  }
  if (fs.status === 'ACCEPTED') {
    return (
      <button onClick={() => removeReq.mutate()} disabled={removeReq.isPending}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-red-500/20 text-emerald-400 hover:text-red-400 font-bold text-sm transition-all cursor-pointer border border-emerald-500/30 hover:border-red-500/30">
        <UserCheck size={16} /> Amigos
      </button>
    )
  }
  return null
}

// ── Public Overview ───────────────────────────────────────────────────────────
function PublicOverview({ p }) {
  if (!p) return <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-24" />)}</div>

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard icon={Zap}      label="XP Total"    value={p.xp}               color="#a78bfa" />
        <StatCard icon={Flame}    label="Sequência"   value={p.streak}           color="#ef4444" suffix="dias" />
        <StatCard icon={Target}   label="Atividades"  value={p.activityStats?.total || 0} color="#22d3ee" />
        <StatCard icon={CheckCircle} label="Acertos"  value={p.activityStats?.correct || 0} color="#10b981" />
        <StatCard icon={Star}     label="Taxa Acerto" value={`${p.activityStats?.hitRate || 0}%`} color="#f59e0b" />
        <StatCard icon={Trophy}   label="Conquistas"  value={p._count?.userAchievements || 0} color="#ec4899" />
      </div>

      <div className="glass border border-white/10 rounded-2xl p-4 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Shield size={18} className="text-purple-400" />
          </div>
          <div>
            <div className="text-[10px] text-[var(--muted)] uppercase font-bold tracking-widest">Aura</div>
            <div className="text-sm font-bold">{p.equippedAura || 'Nenhuma'}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <Star size={18} className="text-cyan-400" />
          </div>
          <div>
            <div className="text-[10px] text-[var(--muted)] uppercase font-bold tracking-widest">Acessório</div>
            <div className="text-sm font-bold">{p.equippedAccessory || 'Nenhum'}</div>
          </div>
        </div>
      </div>

      {p.userAchievements?.length > 0 && (
        <div>
          <h3 className="font-bold text-[var(--muted)] text-xs uppercase tracking-widest mb-4">Conquistas</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {p.userAchievements.slice(0, 9).map(ua => (
              <AchievementCard key={ua.id} achievement={ua.achievement} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Public Stats ──────────────────────────────────────────────────────────────
function PublicStats({ p }) {
  if (!p) return <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
  const lv = p.levelInfo || {}
  return (
    <div className="space-y-4">
      <div className="glass border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[11px] text-[var(--muted)] uppercase font-bold tracking-widest">Nível</div>
            <div className="font-black text-2xl">{p.level}</div>
          </div>
          <RankBadge rank={p.rankPosition} />
        </div>
        <XPBar current={lv.currentLevelXp} max={lv.nextLevelXp} color="#7c3aed" />
        <div className="text-xs text-[var(--muted)] mt-2 text-right">{lv.currentLevelXp?.toLocaleString()} / {lv.nextLevelXp?.toLocaleString()} XP</div>
      </div>
      <div className="glass border border-white/10 rounded-2xl p-6 text-center">
        <div className="text-[11px] text-[var(--muted)] uppercase font-bold tracking-widest mb-1">Membro desde</div>
        <div className="font-bold">{p.createdAt ? new Date(p.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : '—'}</div>
      </div>
    </div>
  )
}

// ── Public Inventory ──────────────────────────────────────────────────────────
function PublicInventory({ p }) {
  if (!p?.purchases) return <div className="grid grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-32" />)}</div>
  return (
    <div>
      {p.purchases.length === 0
        ? <div className="text-center py-16 text-[var(--muted)] text-sm">Nenhum item visível.</div>
        : <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {p.purchases.map(i => (
              <motion.div key={i.id} whileHover={{ y: -4 }} className="glass border border-white/10 rounded-2xl overflow-hidden">
                <div className="h-28 bg-black/30">
                  <RewardImage imageUrl={i.reward.imageUrl} emoji={i.reward.emoji} title={i.reward.title} rarity={i.reward.rarity} containerClassName="h-full" />
                </div>
                <div className="p-2">
                  <div className="text-xs font-bold truncate">{i.reward.title}</div>
                </div>
              </motion.div>
            ))}
          </div>
      }
    </div>
  )
}

const PUBLIC_TABS = [
  { id: 'overview', label: 'Visão Geral', icon: User },
  { id: 'stats',    label: 'Estatísticas', icon: BarChart2 },
  { id: 'achievements', label: 'Conquistas', icon: Trophy },
  { id: 'inventory', label: 'Inventário', icon: Package },
]

// ── MAIN PublicProfilePage ────────────────────────────────────────────────────
export default function PublicProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: me } = useAuthStore()
  const [activeTab, setActiveTab] = useState('overview')

  const { data: p, isLoading } = useQuery({
    queryKey: ['public-profile', id],
    queryFn: () => api.get(`/users/${id}/public-profile`).then(r => r.data),
    enabled: !!id
  })

  // If visiting own profile, redirect
  if (me?.id === id) {
    navigate('/profile', { replace: true })
    return null
  }

  const auraData = p?.equippedAura ? AURAS[p.equippedAura] : null
  const bannerColor1 = auraData?.glow || p?.avatarColor || '#4f46e5'
  const bannerColor2 = auraData?.glow2 || '#1e1b4b'

  const tabContent = {
    overview:     <PublicOverview p={p} />,
    stats:        <PublicStats p={p} />,
    achievements: <AchievementsTab p={p} />,
    inventory:    <PublicInventory p={p} />,
  }

  return (
    <div className="pb-24 max-w-5xl mx-auto">
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[var(--muted)] hover:text-white mb-4 transition-colors cursor-pointer">
        <ChevronLeft size={18} /> Voltar
      </button>

      {/* Banner */}
      <div className="relative mb-20">
        <ProfileBanner auraColor={bannerColor1} auraColor2={bannerColor2}>
          <div className="absolute inset-0 z-10" />
        </ProfileBanner>

        <div className="absolute -bottom-16 left-8 z-20 flex items-end gap-5">
          <div className="ring-4 ring-[var(--bg)] rounded-full">
            {isLoading ? <Skeleton className="w-28 h-28 rounded-full" /> : <AvatarWithAura user={p} size="xl" showAccessory={true} />}
          </div>
          <div className="mb-2">
            {isLoading ? (
              <><Skeleton className="h-7 w-36 mb-2" /><Skeleton className="h-4 w-24" /></>
            ) : (
              <>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-black text-2xl text-white leading-none">{p?.name}</h1>
                  <RankBadge rank={p?.rankPosition} />
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">Nv. {p?.level}</span>
                </div>
                <p className="text-[var(--muted)] text-sm mt-1">{p?.bio || 'Sem bio.'}</p>
              </>
            )}
          </div>
        </div>

        <div className="absolute top-4 right-4 z-20">
          {p && me && <FollowButton targetId={p.id} myId={me.id} />}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-8">
        {PUBLIC_TABS.map(t => {
          const Icon = t.icon
          const active = activeTab === t.id
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer border ${active ? 'profile-tab-active' : 'border-transparent text-[var(--muted)] hover:bg-white/5 hover:text-white'}`}>
              <Icon size={15} />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {tabContent[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Re-export for achievements tab reuse
function AchievementsTab({ p }) {
  if (!p?.userAchievements) return <div className="grid grid-cols-3 gap-4">{[...Array(9)].map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {p.userAchievements.length === 0
        ? <div className="col-span-5 text-center py-16 text-[var(--muted)] text-sm">Nenhuma conquista ainda.</div>
        : p.userAchievements.map((ua, i) => (
            <motion.div key={ua.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}>
              <AchievementCard achievement={ua.achievement} />
            </motion.div>
          ))
      }
    </div>
  )
}
