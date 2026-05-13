import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Plus, List, CheckSquare, BarChart2, LogOut } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/teacher',            icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/teacher/create',     icon: Plus,            label: 'Criar Atividade' },
  { to: '/teacher/activities', icon: List,            label: 'Minhas Atividades' },
  { to: '/teacher/grading',    icon: CheckSquare,     label: 'Correções' },
  { to: '/teacher/reports',    icon: BarChart2,       label: 'Relatórios' },
]

export default function TeacherLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Até logo! 👋')
    navigate('/login')
  }

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="blobs"><div className="blob b1"/><div className="blob b2"/><div className="blob b3"/></div>
      <div className="bg-grid"/>

      <nav className="hidden lg:flex fixed top-0 left-0 bottom-0 z-50 w-60 flex-col glass"
        style={{ borderRight: '1px solid var(--border)', padding: '24px 12px' }}>
        <div className="flex items-center gap-3 px-2 pb-5 mb-5 border-b border-[var(--border)]">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,211,238,.2)', border: '1px solid rgba(34,211,238,.3)' }}>
            <span className="text-lg">👨‍🏫</span>
          </div>
          <div>
            <div className="font-display text-base font-bold tracking-wide grad-text">Professor</div>
            <div className="text-[11px] text-[var(--muted)]">{user?.name}</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-0.5">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} strokeWidth={1.8} />{label}
            </NavLink>
          ))}
        </div>

        <div className="pt-4 border-t border-[var(--border)]">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/5 transition-all text-sm">
            <LogOut size={16} /> Sair da conta
          </button>
        </div>
      </nav>

      <main className="lg:ml-60 min-h-screen">
        <div className="relative z-10 p-4 lg:p-8">
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  )
}
