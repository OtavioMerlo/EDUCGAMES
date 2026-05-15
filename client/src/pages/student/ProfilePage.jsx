import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import {
  User, BarChart2, Package, Trophy, Activity, Settings,
  Zap, Coins, Flame, Target, Star, Users, Calendar, Shield,
  Edit3, Save, X, CheckCircle
} from 'lucide-react'
import api from '../../services/api'
import useAuthStore from '../../store/useAuthStore'
import toast from 'react-hot-toast'
import AvatarWithAura, { AURAS } from '../../components/ui/AvatarWithAura'
import RewardImage from '../../components/ui/RewardImage'
import {
  XPBar, RankBadge, StatCard, AchievementCard, ProfileBanner, ActivityFeedItem
} from '../../components/ui/ProfileComponents'

const AVATAR_COLORS = [
  '#7c3aed', '#ec4899', '#22d3ee', '#10b981', '#f59e0b', 
  '#6366f1', '#ef4444', '#06b6d4', '#a855f7', '#f97316',
  '#000000', '#ffffff', '#475569', '#fb7185', '#d946ef',
  '#818cf8', '#a3e635', '#52525b', '#4c1d95', '#991b1b'
]

const TABS = [
  { id: 'overview',     label: 'Visão Geral',  icon: User },
  { id: 'stats',        label: 'Estatísticas', icon: BarChart2 },
  { id: 'inventory',    label: 'Inventário',   icon: Package },
  { id: 'achievements', label: 'Conquistas',   icon: Trophy },
  { id: 'activity',     label: 'Atividade',    icon: Activity },
  { id: 'edit',         label: 'Editar',       icon: Settings },
]

import Skeleton from '../../components/ui/Skeleton'

// ── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ p }) {
  if (!p) return <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[...Array(8)].map((_, i) => <Skeleton key={i} className="h-24" />)}</div>

  const auraData = p.equippedAura ? AURAS[p.equippedAura] : null

  return (
    <div className="space-y-8">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Zap}      label="XP Total"    value={p.xp}               color="#a78bfa" />
        <StatCard icon={Coins}    label="Moedas"      value={p.coins}            color="#fbbf24" />
        <StatCard icon={Flame}    label="Sequência"   value={p.streak}           color="#ef4444" suffix="dias" />
        <StatCard icon={Target}   label="Atividades"  value={p.activityStats?.total || 0} color="#22d3ee" />
        <StatCard icon={CheckCircle} label="Acertos"  value={p.activityStats?.correct || 0} color="#10b981" />
        <StatCard icon={Star}     label="Taxa Acerto" value={`${p.activityStats?.hitRate || 0}%`} color="#f59e0b" />
        <StatCard icon={Trophy}   label="Conquistas"  value={p._count?.userAchievements || 0} color="#ec4899" />
        <StatCard icon={Users}    label="Amigos"      value={p.friendsCount || 0} color="#6366f1" />
      </div>

      {/* Equipped Items */}
      <div>
        <h3 className="font-bold text-[var(--muted)] text-xs uppercase tracking-widest mb-4">Itens Equipados</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass border border-white/10 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 flex-shrink-0">
              <AvatarWithAura user={p} size="md" showAccessory={false} />
            </div>
            <div>
              <div className="text-[11px] text-[var(--muted)] uppercase font-bold tracking-widest mb-0.5">Aura Ativa</div>
              <div className="font-bold text-sm" style={{ color: auraData?.glow || 'var(--text)' }}>
                {p.equippedAura || 'Nenhuma'}
              </div>
            </div>
          </div>
          <div className="glass border border-white/10 rounded-2xl p-4 flex items-center gap-4">
            <Shield size={24} className="text-cyan-400 flex-shrink-0" />
            <div>
              <div className="text-[11px] text-[var(--muted)] uppercase font-bold tracking-widest mb-0.5">Acessório</div>
              <div className="font-bold text-sm text-cyan-300">{p.equippedAccessory || 'Nenhum'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Achievements */}
      {p.userAchievements?.length > 0 && (
        <div>
          <h3 className="font-bold text-[var(--muted)] text-xs uppercase tracking-widest mb-4">Conquistas Recentes</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {p.userAchievements.slice(0, 6).map(ua => (
              <AchievementCard key={ua.id} achievement={ua.achievement} unlockedAt={ua.unlockedAt} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Stats Tab ────────────────────────────────────────────────────────────────
function StatsTab({ p }) {
  if (!p) return <div className="space-y-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>

  const lv = p.levelInfo || {}
  const xpPct = lv.nextLevelXp > 0 ? Math.round((lv.currentLevelXp / lv.nextLevelXp) * 100) : 0

  const stats = [
    { label: 'XP Total Acumulado',   value: p.xp?.toLocaleString('pt-BR') + ' XP', color: '#a78bfa', pct: null },
    { label: 'Moedas Atuais',        value: '🪙 ' + p.coins?.toLocaleString('pt-BR'), color: '#fbbf24', pct: null },
    { label: 'Atividades Concluídas',value: p.activityStats?.correct + ' corretas de ' + p.activityStats?.total, color: '#10b981', pct: p.activityStats?.hitRate },
    { label: 'Sequência Atual',      value: p.streak + ' dias consecutivos', color: '#ef4444', pct: Math.min(100, p.streak * 3) },
    { label: 'XP Ganho em Atividades', value: (p.activityStats?.xpEarned || 0).toLocaleString('pt-BR') + ' XP', color: '#22d3ee', pct: null },
    { label: 'Conquistas',           value: p._count?.userAchievements + ' desbloqueadas', color: '#ec4899', pct: Math.min(100, (p._count?.userAchievements || 0) * 5) },
  ]

  return (
    <div className="space-y-6">
      {/* XP Progress */}
      <div className="glass border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[11px] text-[var(--muted)] uppercase font-bold tracking-widest">Progresso de Nível</div>
            <div className="font-black text-2xl text-[var(--text)] mt-0.5">Nível {p.level}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-[var(--muted)]">{lv.currentLevelXp?.toLocaleString()} / {lv.nextLevelXp?.toLocaleString()} XP</div>
            <div className="text-xs text-purple-400">{xpPct}% completo</div>
          </div>
        </div>
        <XPBar current={lv.currentLevelXp} max={lv.nextLevelXp} color="#7c3aed" />
      </div>

      {/* Stats bars */}
      <div className="grid md:grid-cols-2 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="glass border border-white/10 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-[var(--muted)] font-bold uppercase tracking-widest">{s.label}</span>
              <span className="font-black text-sm" style={{ color: s.color }}>{s.value}</span>
            </div>
            {s.pct !== null && (
              <div className="xp-bar-track">
                <motion.div className="xp-bar-fill" initial={{ width: 0 }} animate={{ width: `${s.pct}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  style={{ background: `linear-gradient(90deg, ${s.color}, ${s.color}88)` }} />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Account Info */}
      <div className="glass border border-white/10 rounded-2xl p-6 grid md:grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-[11px] text-[var(--muted)] uppercase font-bold tracking-widest mb-1">Membro Desde</div>
          <div className="font-bold">{p.createdAt ? new Date(p.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : '—'}</div>
        </div>
        <div>
          <div className="text-[11px] text-[var(--muted)] uppercase font-bold tracking-widest mb-1">Ranking Global</div>
          <RankBadge rank={p.rankPosition} />
        </div>
        <div>
          <div className="text-[11px] text-[var(--muted)] uppercase font-bold tracking-widest mb-1">Itens Coletados</div>
          <div className="font-bold">{p._count?.purchases || 0} itens</div>
        </div>
      </div>
    </div>
  )
}

// ── Inventory Tab ────────────────────────────────────────────────────────────
function InventoryTab({ p }) {
  const [filter, setFilter] = useState('ALL')
  if (!p?.purchases) return <div className="grid grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-36" />)}</div>

  const cats = ['ALL', 'COSMETIC', 'ACCESSORY', 'GAME', 'SUBSCRIPTION']
  const catLabels = { ALL: 'Todos', COSMETIC: 'Auras', ACCESSORY: 'Acessórios', GAME: 'Jogos', SUBSCRIPTION: 'Serviços' }
  const items = filter === 'ALL' ? p.purchases : p.purchases.filter(i => i.reward.category === filter)

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer border ${filter === c ? 'profile-tab-active border-purple-500/50' : 'border-white/10 text-[var(--muted)] hover:bg-white/5'}`}>
            {catLabels[c]}
          </button>
        ))}
      </div>
      {items.length === 0 ? (
        <div className="text-center py-16 text-[var(--muted)] text-sm">Nenhum item nesta categoria ainda.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map(i => (
            <motion.div key={i.id} whileHover={{ y: -4 }} className="glass border border-white/10 rounded-2xl overflow-hidden">
              <div className="h-32 bg-black/30">
                <RewardImage imageUrl={i.reward.imageUrl} emoji={i.reward.emoji} title={i.reward.title} rarity={i.reward.rarity} containerClassName="h-full" />
              </div>
              <div className="p-3">
                <div className="text-xs font-bold truncate">{i.reward.title}</div>
                <div className="text-[10px] text-[var(--muted)] uppercase">{i.reward.category}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Achievements Tab ─────────────────────────────────────────────────────────
function AchievementsTab({ p }) {
  if (!p?.userAchievements) return <div className="grid grid-cols-3 gap-4">{[...Array(9)].map((_, i) => <Skeleton key={i} className="h-28" />)}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-lg">{p.userAchievements.length} Conquistas Desbloqueadas</h3>
        <span className="text-[var(--muted)] text-sm">{p._count?.userAchievements} total</span>
      </div>
      {p.userAchievements.length === 0 ? (
        <div className="text-center py-16 text-[var(--muted)] text-sm">Nenhuma conquista ainda. Comece a estudar!</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {p.userAchievements.map((ua, i) => (
            <motion.div key={ua.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}>
              <AchievementCard achievement={ua.achievement} unlockedAt={ua.unlockedAt} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Activity Tab ─────────────────────────────────────────────────────────────
function ActivityTab({ p }) {
  if (!p?.recentActivity) return <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14" />)}</div>

  return (
    <div className="space-y-4">
      <h3 className="font-black text-lg">Atividade Recente</h3>
      <div className="glass border border-white/10 rounded-2xl divide-y divide-white/5">
        {p.recentActivity?.length === 0 ? (
          <div className="p-8 text-center text-[var(--muted)] text-sm">Nenhuma atividade registrada ainda.</div>
        ) : (
          p.recentActivity?.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
              <ActivityFeedItem item={item} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

// ── Edit Tab ─────────────────────────────────────────────────────────────────
function EditTab({ p, user, updateUser, qc }) {
  const [selectedColor, setSelectedColor] = useState(p?.avatarColor || '#7c3aed')
  const { register, handleSubmit } = useForm({ defaultValues: { name: p?.name || '', bio: p?.bio || '' } })

  const updateMutation = useMutation({
    mutationFn: (data) => api.put('/users/profile', data),
    onSuccess: ({ data }) => {
      updateUser(data)
      qc.invalidateQueries(['my-full-profile'])
      toast.success('Perfil atualizado!')
    },
    onError: () => toast.error('Erro ao atualizar perfil')
  })

  return (
    <form onSubmit={handleSubmit(d => updateMutation.mutate({ ...d, avatarColor: selectedColor }))} className="max-w-lg space-y-6">
      <div>
        <label className="text-[11px] text-[var(--muted)] font-bold uppercase tracking-wider mb-2 block">Nome Público</label>
        <input type="text" {...register('name')} className="input-field w-full" style={{ paddingLeft: 16 }} />
      </div>
      <div>
        <label className="text-[11px] text-[var(--muted)] font-bold uppercase tracking-wider mb-2 block">Bio / Status</label>
        <textarea {...register('bio')} rows={3} placeholder="Escreva algo sobre você..."
          className="w-full p-4 rounded-xl text-sm resize-none outline-none border border-white/10 bg-white/5 text-[var(--text)] focus:border-purple-500/50 transition-colors" />
      </div>
      <div>
        <label className="text-[11px] text-[var(--muted)] font-bold uppercase tracking-wider mb-3 block">Cor do Avatar</label>
        <div className="flex gap-2 flex-wrap">
          {AVATAR_COLORS.map(c => (
            <button key={c} type="button" onClick={() => setSelectedColor(c)}
              className="w-9 h-9 rounded-full transition-all cursor-pointer"
              style={{ background: c, boxShadow: selectedColor === c ? `0 0 0 3px var(--bg), 0 0 0 5px ${c}` : 'none', transform: selectedColor === c ? 'scale(1.15)' : 'scale(1)' }} />
          ))}
        </div>
      </div>
      <button type="submit" disabled={updateMutation.isPending}
        className="btn-primary flex items-center gap-2">
        <Save size={16} /> {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
      </button>
    </form>
  )
}

// ── MAIN ProfilePage ──────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const qc = useQueryClient()
  const [activeTab, setActiveTab] = useState('overview')

  const { data: p, isLoading } = useQuery({
    queryKey: ['my-full-profile'],
    queryFn: () => api.get('/users/my/full-profile').then(r => r.data),
    staleTime: 60_000
  })

  const auraData = p?.equippedAura ? AURAS[p.equippedAura] : null
  const bannerColor1 = auraData?.glow || p?.avatarColor || '#7c3aed'
  const bannerColor2 = auraData?.glow2 || '#1e1b4b'

  const tabContent = {
    overview:     <OverviewTab p={p} />,
    stats:        <StatsTab p={p} />,
    inventory:    <InventoryTab p={p} />,
    achievements: <AchievementsTab p={p} />,
    activity:     <ActivityTab p={p} />,
    edit:         <EditTab p={p} user={user} updateUser={updateUser} qc={qc} />,
  }

  return (
    <div className="pb-32 max-w-6xl mx-auto px-4">
      {/* ── Banner + Avatar Header ── */}
      <div className="relative mb-32">
        <ProfileBanner auraColor={bannerColor1} auraColor2={bannerColor2}>
          <div className="absolute inset-0 z-10" />
        </ProfileBanner>

        {/* Avatar floating over banner */}
        <div className="absolute -bottom-20 left-4 md:left-12 z-20 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
          <div className="relative">
             <div className="ring-[12px] ring-[var(--bg)] rounded-full shadow-2xl">
               {isLoading
                 ? <Skeleton className="w-32 h-32 md:w-44 md:h-44 rounded-full" />
                 : <AvatarWithAura user={p} size="xl" showAccessory={true} />
               }
             </div>
          </div>
          
          <div className="mb-4 text-center md:text-left">
            {isLoading ? (
              <><Skeleton className="h-9 w-48 mb-3" /><Skeleton className="h-4 w-32 mb-4" /><Skeleton className="h-16 w-full" /></>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <h1 className="font-black text-3xl md:text-5xl text-white tracking-tight">{p?.name}</h1>
                  <div className="flex items-center gap-2">
                    <RankBadge rank={p?.rankPosition} />
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black uppercase tracking-widest border border-purple-500/30">Nv. {p?.level}</span>
                  </div>
                </div>
                <p className="text-[var(--muted)] text-sm md:text-base leading-relaxed max-w-2xl font-medium">
                  {p?.bio || 'Nenhuma biografia disponível ainda. Edite seu perfil para contar mais sobre você!'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Top-right badges */}
        <div className="absolute top-6 right-6 flex flex-col md:flex-row items-end md:items-center gap-3 z-20">
          <div className="glass border border-white/20 rounded-2xl px-5 py-2.5 flex items-center gap-3 backdrop-blur-md shadow-xl">
            <Zap size={16} className="text-purple-400" />
            <span className="text-sm md:text-base font-black text-white tracking-tight">{p?.xp?.toLocaleString('pt-BR') || 0} XP</span>
          </div>
          <div className="glass border border-white/20 rounded-2xl px-5 py-2.5 flex items-center gap-3 backdrop-blur-md shadow-xl">
            <span className="text-sm md:text-base font-black text-yellow-400">🪙 {p?.coins?.toLocaleString('pt-BR') || 0}</span>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none border-b border-white/5">
        {TABS.map(t => {
          const Icon = t.icon
          const active = activeTab === t.id
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all cursor-pointer border-2 ${active ? 'profile-tab-active' : 'border-transparent text-[var(--muted)] hover:bg-white/5 hover:text-white'}`}>
              <Icon size={18} />
              <span>{t.label}</span>
            </button>
          )
        })}
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}>
          {tabContent[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
