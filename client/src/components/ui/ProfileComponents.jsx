import { motion } from 'framer-motion'
import AvatarWithAura from '../../components/ui/AvatarWithAura'
import { Trophy, Zap, Flame, Target, Star, Users, ShoppingBag, Calendar } from 'lucide-react'

// ── XP Bar ──────────────────────────────────────────────────────────────────
export function XPBar({ current, max, color = '#7c3aed' }) {
  const pct = Math.min(100, max > 0 ? Math.round((current / max) * 100) : 0)
  return (
    <div className="xp-bar-track">
      <motion.div
        className="xp-bar-fill"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        style={{ background: `linear-gradient(90deg, ${color}, ${color}cc)` }}
      />
    </div>
  )
}

// ── Rank Badge ───────────────────────────────────────────────────────────────
export function RankBadge({ rank }) {
  if (!rank) return null
  const cls = rank === 1 ? 'rank-badge-gold' : rank <= 10 ? 'rank-badge-purple' : 'bg-white/10 text-white'
  const icon = rank === 1 ? '👑' : rank <= 3 ? '🥈' : rank <= 10 ? '⭐' : '#'
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${cls}`}>
      {icon} {rank}°
    </span>
  )
}

// ── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ icon: Icon, label, value, color = '#7c3aed', suffix = '' }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="stat-card-glow glass border border-white/10 rounded-2xl p-4 flex flex-col gap-1 cursor-default"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}22` }}>
          <Icon size={16} style={{ color }} />
        </div>
        <span className="text-[11px] text-[var(--muted)] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-2xl font-black text-[var(--text)]">
        {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
        {suffix && <span className="text-sm text-[var(--muted)] font-normal ml-1">{suffix}</span>}
      </div>
    </motion.div>
  )
}

// ── Achievement Card ─────────────────────────────────────────────────────────
const RARITY_ACH = {
  COMMON:    { color: '#9ca3af', glow: '' },
  RARE:      { color: '#60a5fa', glow: '0 0 12px rgba(96,165,250,0.3)' },
  EPIC:      { color: '#a78bfa', glow: '0 0 16px rgba(167,139,250,0.4)' },
  LEGENDARY: { color: '#fbbf24', glow: '0 0 24px rgba(251,191,36,0.5)' },
}

export function AchievementCard({ achievement, unlockedAt }) {
  const r = RARITY_ACH[achievement.rarity] || RARITY_ACH.COMMON
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="achievement-shine glass border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center gap-2 cursor-default"
      style={{ boxShadow: r.glow, borderColor: `${r.color}33` }}
    >
      <div className="text-3xl">{achievement.emoji}</div>
      <div className="text-xs font-black text-[var(--text)] leading-tight">{achievement.title}</div>
      <div className="text-[10px] px-2 py-0.5 rounded-full font-bold"
        style={{ background: `${r.color}22`, color: r.color }}>
        {achievement.rarity}
      </div>
    </motion.div>
  )
}

// ── Profile Banner ───────────────────────────────────────────────────────────
export function ProfileBanner({ auraColor, auraColor2, children }) {
  const c1 = auraColor || '#7c3aed'
  const c2 = auraColor2 || '#4f46e5'
  return (
    <div className="profile-banner rounded-3xl mb-0">
      <div
        className="profile-banner-mesh"
        style={{
          background: `linear-gradient(135deg, ${c1}, ${c2}, #0f0f2e, ${c1})`
        }}
      />
      {children}
    </div>
  )
}

// ── Activity Feed Item ───────────────────────────────────────────────────────
export function ActivityFeedItem({ item }) {
  const isApproved = item.status === 'APPROVED' || item.status === 'GRADED'
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isApproved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
        {isApproved ? <Zap size={14} /> : <Target size={14} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-[var(--text)] truncate">{item.activity?.title || 'Atividade'}</div>
        <div className="text-[11px] text-[var(--muted)]">{item.activity?.subject} · {isApproved ? `+${item.xpAwarded} XP` : 'Pendente'}</div>
      </div>
      <div className="text-[10px] text-[var(--muted)] flex-shrink-0">
        {new Date(item.submittedAt).toLocaleDateString('pt-BR')}
      </div>
    </div>
  )
}
