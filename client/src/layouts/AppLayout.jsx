import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home, BookOpen, Trophy, ShoppingBag, Star, User, History,
  LogOut, Bell, Coins, Flame, Zap, LayoutGrid, Sun, Moon, Users
} from 'lucide-react'

import useAuthStore from '../store/useAuthStore'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import toast from 'react-hot-toast'
import AvatarWithAura from '../components/ui/AvatarWithAura'
import { formatCompact } from '../utils/format'
import CommandPalette from '../components/ui/CommandPalette'

const navItems = [
  { to: '/dashboard',    icon: Home,        label: 'Início' },
  { to: '/activities',   icon: BookOpen,    label: 'Atividades' },
  { to: '/ranking',      icon: Trophy,      label: 'Ranking' },
  { to: '/loja24',       icon: Zap,         label: 'Loja24', isSpecial: true },
  { to: '/store',        icon: ShoppingBag, label: 'Loja' },
  { to: '/inventory',    icon: LayoutGrid,  label: 'Inventário' },
  { to: '/achievements', icon: Star,        label: 'Conquistas' },
  { to: '/players',      icon: Users,       label: 'Jogadores' },
  { to: '/profile',      icon: User,        label: 'Perfil' },
  { to: '/history',      icon: History,     label: 'Histórico' },
]

function XpBar({ user }) {
  const xpForLevel = (l) => Math.floor(100 + Math.pow(l - 1, 2) * 2.5)
  const level = user?.level || 1
  const xp = user?.xp || 0
  
  const totalXpToReachLevel = (lvl) => {
    let total = 0
    for (let i = 1; i < lvl; i++) total += xpForLevel(i)
    return total
  }

  const startOfLevelXp = totalXpToReachLevel(level)
  const currentLevelProgress = Math.max(0, xp - startOfLevelXp)
  const requiredForNextLevel = xpForLevel(level)
  const pct = Math.min(100, Math.round((currentLevelProgress / requiredForNextLevel) * 100))

  return (
    <div className="px-2 pb-4 border-b border-[var(--border)] mb-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0 shadow-glow"
          style={{ background: 'var(--grad)' }}>
          <span className="text-[9px] font-bold opacity-80 uppercase tracking-wider keep-white">nível</span>
          <span className="font-display text-lg font-bold leading-none keep-white">{level}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-[var(--muted)]">Experiência</span>
            <span className="text-[var(--muted)]">{pct}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-white/5">
            <motion.div className="xp-bar-fill" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
          </div>
          <div className="text-[10px] text-[var(--muted)] mt-1">{currentLevelProgress} / {requiredForNextLevel} XP</div>
        </div>
      </div>
    </div>
  )
}

export default function AppLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [isLight, setIsLight] = useState(() => localStorage.getItem('theme') === 'light')

  useEffect(() => {
    if (isLight) {
      document.body.classList.add('light')
      localStorage.setItem('theme', 'light')
    } else {
      document.body.classList.remove('light')
      localStorage.setItem('theme', 'dark')
    }
  }, [isLight])

  const toggleTheme = () => setIsLight(!isLight)

  const { data: freshUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/auth/me').then(r => r.data),
    refetchInterval: 10000, // Sincronização a cada 10s
  })

  const currentUser = freshUser || user
  const initials = currentUser?.name?.charAt(0).toUpperCase() || '?'

  const handleLogout = async () => {
    await logout()
    toast.success('Até logo! 👋')
    navigate('/login')
  }

  return (
    <div className="relative min-h-screen bg-[var(--bg)] transition-colors duration-500">
      {/* Background effects */}
      <div className="blobs"><div className="blob b1"/><div className="blob b2"/><div className="blob b3"/></div>
      <div className="bg-grid"/>

      {/* ── DESKTOP SIDEBAR ── */}
      <nav className="hidden lg:flex fixed top-0 left-0 bottom-0 z-50 w-60 flex-col glass"
        style={{ borderRight: '1px solid var(--border)', padding: '24px 12px' }}>

        {/* Logo Section */}
        <div className="px-2 pb-6 mb-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 p-2 flex items-center justify-center shadow-lg">
               <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
               <h1 className="font-display font-black text-2xl tracking-tighter leading-none text-[var(--text)]">
                 Educa<span className="text-[var(--purple-l)]">Games</span>
               </h1>
               <div className="text-[10px] uppercase font-black tracking-widest text-[var(--muted)] opacity-80">TCC Edition</div>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <div className="flex-1 min-w-0">
              <CommandPalette />
            </div>
            <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/10 transition-all shadow-sm flex-shrink-0">
              {isLight ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>

        {/* XP Bar */}
        <XpBar user={currentUser} />

        {/* Coins + Streak */}
        <div className="flex gap-2 px-2 mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.3)', color: '#fbbf24' }}>
            🪙 {formatCompact(currentUser?.coins || 0)}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: 'rgba(236,72,153,.1)', border: '1px solid rgba(236,72,153,.3)', color: '#f472b6' }}>
            🔥 {formatCompact(currentUser?.streak || 0)}
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 flex flex-col gap-0.5">
          {navItems.map(({ to, icon: Icon, label, isSpecial }) => (
            <NavLink key={to} to={to} className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''} ${isSpecial ? 'text-purple-400 font-black' : ''}`}>
              <div className="flex items-center gap-3">
                <Icon size={18} strokeWidth={isSpecial ? 2.5 : 1.8} className={isSpecial ? 'text-purple-500' : ''} />
                {label}
              </div>
              {isSpecial && (
                <span className="ml-auto bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full animate-pulse">HOT</span>
              )}
            </NavLink>
          ))}
        </div>

        {/* User footer */}
        <div className="pt-4 border-t border-[var(--border)]">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/5 transition-all text-sm font-medium">
            <AvatarWithAura user={currentUser} size="sm" />
            <div className="flex-1 text-left min-w-0">
              <div className="text-[13px] font-bold truncate text-[var(--text)]">{currentUser?.name}</div>
              <div className="text-[10px] text-[var(--purple-l)] font-black uppercase">Nível {currentUser?.level}</div>
            </div>
            <LogOut size={15} />
          </button>
        </div>
      </nav>

      {/* ── MOBILE HEADER ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 glass"
        style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <span className="font-display text-lg font-bold tracking-widest">
            <span className="text-[var(--text)]">EDUCA</span>
            <span className="grad-text">GAMES</span>
          </span>
          <div className="flex items-center gap-2">
            <CommandPalette />
            <button onClick={toggleTheme} className="p-2 rounded-lg bg-white/5 border border-white/10 text-[var(--muted)]">
              {isLight ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold"
            style={{ background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.3)', color: '#fbbf24' }}>
            🪙 {formatCompact(currentUser?.coins || 0)}
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold"
            style={{ background: 'rgba(236,72,153,.1)', border: '1px solid rgba(236,72,153,.3)', color: '#f472b6' }}>
            🔥 {formatCompact(currentUser?.streak || 0)}
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="lg:ml-60 min-h-screen pt-0 lg:pt-0">
        <div className="relative z-10 p-4 lg:p-8 pt-20 lg:pt-8 pb-24 lg:pb-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}>
            <Outlet />
          </motion.div>
        </div>
      </main>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex glass items-end"
        style={{ borderTop: '1px solid var(--border)', padding: '6px 0' }}>
        {navItems.filter(i => !['/history', '/profile', '/achievements', '/ranking', '/store'].includes(i.to)).map(({ to, icon: Icon, label, isSpecial }) => (
          <NavLink key={to} to={to} className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-2 text-[10px] font-semibold tracking-wide transition-all ${
              isSpecial ? 'mb-2' : ''
            } ${isActive ? 'text-[var(--purple-l)]' : 'text-[var(--muted)]'}`}>
            
            {isSpecial ? (
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500 blur-lg opacity-40 animate-pulse" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/40 -mt-8 border-4 border-[var(--bg)]">
                   <Icon size={22} className="text-white" fill="currentColor" />
                </div>
              </div>
            ) : (
              <Icon size={20} strokeWidth={1.8} />
            )}
            <span className={isSpecial ? 'mt-1' : ''}>{label}</span>
          </NavLink>
        ))}
        {/* Profile extra item for mobile */}
        <NavLink to="/profile" className={({ isActive }) =>
          `flex-1 flex flex-col items-center gap-1 py-2 text-[10px] font-semibold tracking-wide transition-colors ${isActive ? 'text-[var(--purple-l)]' : 'text-[var(--muted)]'}`}>
          <User size={20} strokeWidth={1.8} />
          <span>Perfil</span>
        </NavLink>
      </nav>
    </div>
  )
}
