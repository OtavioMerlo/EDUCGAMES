import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Gamepad2, Gift, Music, Search, Check, ExternalLink, LayoutGrid, Shirt, ShieldCheck, X } from 'lucide-react'
import api from '../../services/api'
import useAuthStore from '../../store/useAuthStore'
import toast from 'react-hot-toast'
import AvatarWithAura, { AURAS } from '../../components/ui/AvatarWithAura'
import RewardImage from '../../components/ui/RewardImage'

const RARITY = {
  COMMON:    { label: 'Comum',    color: '#9ca3af', bg: 'rgba(156,163,175,0.12)', border: '#9ca3af44' },
  RARE:      { label: 'Raro',     color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: '#60a5fa44' },
  EPIC:      { label: 'Épico',    color: '#a78bfa', bg: 'rgba(167,139,250,0.15)', border: '#a78bfa55' },
  LEGENDARY: { label: 'Lendário', color: '#fbbf24', bg: 'rgba(251,191,36,0.18)',  border: '#fbbf2466' },
}

const TABS = [
  { id: 'ALL',          label: 'Todos',       icon: LayoutGrid, color: '#ffffff' },
  { id: 'COSMETIC',     label: 'Auras',       icon: Sparkles,   color: '#a78bfa' },
  { id: 'ACCESSORY',    label: 'Acessórios',  icon: Shirt,      color: '#22d3ee' },
  { id: 'GAME',         label: 'Jogos',       icon: Gamepad2,   color: '#60a5fa' },
  { id: 'GIFT_CARD',    label: 'Gifts',       icon: Gift,       color: '#f472b6' },
  { id: 'SUBSCRIPTION', label: 'Serviços',    icon: Music,      color: '#34d399' },
]

export default function InventoryPage() {
  const { user, updateUser } = useAuthStore()
  const [tab, setTab] = useState('ALL')
  const [search, setSearch] = useState('')
  const qc = useQueryClient()

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/users/profile').then(r => r.data)
  })

  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/auth/me').then(r => r.data)
  })

  const { data: purchases = [], isLoading } = useQuery({
    queryKey: ['my-purchases'],
    queryFn: () => api.get('/rewards/my-purchases').then(r => r.data)
  })

  const equipAura = useMutation({
    mutationFn: (auraId) => api.patch('/users/profile/equip-aura', { auraId }),
    onSuccess: ({ data }) => {
      updateUser({ equippedAura: data.equippedAura })
      qc.invalidateQueries(['profile']); qc.invalidateQueries(['me'])
      toast.success(data.equippedAura ? '✨ Aura equipada!' : 'Aura removida.')
    },
    onError: (e) => toast.error(e?.response?.data?.error || 'Erro ao equipar aura.')
  })

  const equipAccessory = useMutation({
    mutationFn: (accessoryId) => api.patch('/users/profile/equip-accessory', { accessoryId }),
    onSuccess: ({ data }) => {
      updateUser({ equippedAccessory: data.equippedAccessory })
      qc.invalidateQueries(['profile']); qc.invalidateQueries(['me'])
      toast.success(data.equippedAccessory ? '👑 Acessório equipado!' : 'Acessório removido.')
    },
    onError: (e) => toast.error(e?.response?.data?.error || 'Erro ao equipar acessório.')
  })

  // Merge profile data from both sources
  const p = { ...(me || user || {}), ...(profile || {}) }

  const items = purchases.filter(i => {
    const matchTab = tab === 'ALL' || i.reward.category === tab
    const matchSearch = i.reward.title.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const count = (cat) => cat === 'ALL' ? purchases.length : purchases.filter(i => i.reward.category === cat).length

  const isBusy = equipAura.isPending || equipAccessory.isPending

  return (
    <div className="pb-24">
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-black tracking-tight mb-1">
          Inventário <span className="text-[var(--purple-l)]">✦</span>
        </h1>
        <p className="text-[var(--muted)] text-sm">{purchases.length} itens desbloqueados</p>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        {/* ── SIDEBAR ── */}
        <aside className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] opacity-50" />
            <input type="text" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-[var(--inp)] border border-[var(--border)] rounded-2xl py-2.5 pl-10 pr-4 text-sm text-[var(--text)] outline-none focus:border-[var(--purple-l)]/50 transition-all" />
          </div>

          {/* Category tabs */}
          <div className="glass rounded-3xl p-3 space-y-1 border border-white/10">
            {TABS.map(t => {
              const Icon = t.icon
              const active = tab === t.id
              const n = count(t.id)
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${active ? 'bg-purple-600/80 text-white shadow-lg' : 'hover:bg-white/5 text-[var(--muted)]'}`}>
                  <Icon size={16} style={{ color: active ? '#fff' : t.color }} />
                  <span className="text-sm font-bold flex-1 text-left">{t.label}</span>
                  {n > 0 && <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-white/5 text-white/40'}`}>{n}</span>}
                </button>
              )
            })}
          </div>

          {/* Avatar preview card */}
          <div className="glass rounded-3xl p-6 border border-white/10 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-purple-500/15 blur-3xl rounded-full pointer-events-none" />
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="mb-2">
                <AvatarWithAura user={p} size="xl" showAccessory={true} />
              </div>
              <h3 className="font-bold mt-6 mb-0.5">{p?.name}</h3>
              <span className="text-[11px] text-purple-400 font-black uppercase tracking-widest mb-4">Nível {p?.level}</span>

              {/* Active cosmetics display */}
              <div className="w-full space-y-2">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold transition-all ${p?.equippedAura ? 'bg-purple-500/15 border border-purple-500/25 text-purple-300' : 'bg-white/5 text-white/20'}`}>
                  <Sparkles size={11} />
                  <span className="flex-1 text-left truncate">{p?.equippedAura || 'Nenhuma aura'}</span>
                  {p?.equippedAura && (
                    <button onClick={() => equipAura.mutate(null)} className="hover:text-red-400 transition-colors cursor-pointer"><X size={11} /></button>
                  )}
                </div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold transition-all ${p?.equippedAccessory ? 'bg-cyan-500/15 border border-cyan-500/25 text-cyan-300' : 'bg-white/5 text-white/20'}`}>
                  <ShieldCheck size={11} />
                  <span className="flex-1 text-left truncate">{p?.equippedAccessory || 'Nenhum acessório'}</span>
                  {p?.equippedAccessory && (
                    <button onClick={() => equipAccessory.mutate(null)} className="hover:text-red-400 transition-colors cursor-pointer"><X size={11} /></button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN GRID ── */}
        <main>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <div key={i} className="aspect-[3/4] rounded-3xl bg-white/5 animate-pulse" />)}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {items.map(item => {
                  const r = item.reward
                  const isAura = r.category === 'COSMETIC'
                  const isAcc = r.category === 'ACCESSORY'
                  const canEquip = isAura || isAcc
                  const isEq = isAura ? p?.equippedAura === r.title : isAcc ? p?.equippedAccessory === r.title : false
                  return (
                    <ItemCard
                      key={item.id}
                      reward={r}
                      isEquipped={isEq}
                      canEquip={canEquip}
                      isAura={isAura}
                      isBusy={isBusy}
                      onEquip={() => isAura ? equipAura.mutate(r.title) : equipAccessory.mutate(r.title)}
                    />
                  )
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 border border-dashed border-[var(--border)] rounded-3xl">
              <Search size={32} className="text-[var(--muted)] opacity-20 mb-4" />
              <h3 className="font-bold text-[var(--muted)] opacity-40">Nenhum item aqui</h3>
              <p className="text-xs text-[var(--muted)] opacity-30 mt-1">Visite a Loja ou a Loja24!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function ItemCard({ reward: r, isEquipped, canEquip, isAura, isBusy, onEquip }) {
  const rar = RARITY[r.rarity] || RARITY.COMMON
  const isLegendary = r.rarity === 'LEGENDARY'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`relative rounded-3xl overflow-hidden cursor-pointer group transition-all ${
        isLegendary ? 'legendary-card border-none shadow-xl' : ''
      }`}
      style={!isLegendary ? {
        background: isEquipped
          ? `linear-gradient(135deg, ${rar.color}18, ${rar.color}08)`
          : 'var(--bg2)',
        border: `1px solid ${isEquipped ? rar.color + '55' : 'var(--border)'}`,
        boxShadow: isEquipped ? `0 0 24px ${rar.color}25, 0 0 60px ${rar.color}10` : 'none',
      } : {}}
      onClick={canEquip && !isBusy ? onEquip : undefined}
    >
      {isLegendary && <div className="legendary-glow" />}

      {/* Visual header */}
      <div className={`h-40 relative overflow-hidden ${isLegendary ? 'h-44' : ''}`}
        style={{ background: r.bgGradient || 'linear-gradient(135deg,#1a0a3d,#2d0a4e)' }}>

        {/* Rarity badge */}
        <div className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg z-20"
          style={{ background: 'rgba(0,0,0,0.6)', color: rar.color, border: `1px solid ${rar.color}44`, backdropFilter: 'blur(4px)' }}>
          {rar.label}
        </div>

        {/* Equipped badge */}
        {isEquipped && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-2xl z-30 border-2 border-emerald-500">
            <Check size={16} className="text-emerald-600" strokeWidth={4} />
          </motion.div>
        )}

        {/* Item visual */}
        <RewardImage 
          imageUrl={r.imageUrl} 
          emoji={r.emoji} 
          title={r.title} 
          rarity={r.rarity}
          containerClassName="h-full"
        />
      </div>

      {/* Body */}
      <div className="p-4 relative z-10">
        <h4 className={`font-bold text-sm mb-1 leading-tight line-clamp-1 transition-colors ${
          isLegendary ? 'font-premium-display gold-text text-base' : 'group-hover:text-[var(--purple-l)]'
        }`}>{r.title}</h4>
        <p className={`text-[10px] text-[var(--muted)] mb-3 uppercase font-black tracking-widest ${
          isLegendary ? 'font-premium-body text-white/60' : ''
        }`}>{r.category} · {rar.label}</p>

        {canEquip ? (
          <button onClick={(e) => { e.stopPropagation(); onEquip(); }} disabled={isBusy}
            className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
              isEquipped 
                ? isLegendary 
                  ? 'bg-gradient-to-r from-[#CA8A04] to-[#fde68a] text-black shadow-lg' 
                  : 'bg-white text-black'
                : 'bg-white/5 text-[var(--muted)] border border-white/10 hover:bg-white/10 hover:text-white'
            }`}>
            {isEquipped ? '✓ Equipado' : 'Equipar'}
          </button>
        ) : (
          <Link to={`/store/${r.id}`} className="w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 transition-all flex items-center justify-center gap-1 hover:bg-blue-500/20">
            <ExternalLink size={12} /> Ver na Loja
          </Link>
        )}
      </div>
    </motion.div>
  )
}
