import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, Users, ShoppingBag, ScrollText, ShieldAlert, 
  ArrowLeft, LogOut, ChevronRight, Settings, Activity, Globe
} from 'lucide-react'
import useAuthStore from '../store/useAuthStore'

const adminNav = [
  { to: '/admin',        icon: LayoutDashboard, label: 'Geral',      desc: 'Analytics e visão geral' },
  { to: '/admin/users',  icon: Users,           label: 'Usuários',   desc: 'Moderação e economia' },
  { to: '/admin/store',  icon: ShoppingBag,     label: 'Loja',       desc: 'Itens e recompensas' },
  { to: '/admin/logs',   icon: ScrollText,      label: 'Logs',       desc: 'Auditoria do sistema' },
]

export default function AdminLayout() {
  const { pathname } = useLocation()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <ShieldAlert size={64} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-black mb-2">Acesso Negado</h1>
        <p className="text-[var(--muted)] mb-6">Você não tem permissão para acessar esta área.</p>
        <button onClick={() => navigate('/')} className="btn-primary px-8">Voltar para Início</button>
      </div>
    )
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#07071a] text-[var(--text)] flex">
      {/* ── Sidebar ── */}
      <aside className="w-80 border-r border-white/5 bg-[#0a0a25]/50 backdrop-blur-xl hidden lg:flex flex-col sticky top-0 h-screen overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <Settings className="text-white" size={24} />
            </div>
            <div>
              <div className="font-black text-xl tracking-tighter uppercase">ADMIN<span className="text-purple-500">PRO</span></div>
              <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Painel de Controle</div>
            </div>
          </div>

          <Link to="/" className="flex items-center gap-2 text-[var(--muted)] hover:text-white transition-colors text-sm font-bold">
            <ArrowLeft size={16} />
            Voltar para a Plataforma
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-6 space-y-2">
          {adminNav.map(item => {
            const active = pathname === item.to || (item.to !== '/admin' && pathname.startsWith(item.to))
            const Icon = item.icon
            return (
              <Link key={item.to} to={item.to} className="block group">
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all border ${
                    active 
                      ? 'bg-purple-500/10 border-purple-500/20 text-white shadow-[0_0_30px_rgba(168,85,247,0.1)]' 
                      : 'border-transparent text-[var(--muted)] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl transition-colors ${active ? 'bg-purple-500 text-white' : 'bg-white/5 text-[var(--muted)] group-hover:text-white'}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-black text-sm uppercase tracking-tight">{item.label}</div>
                    <div className="text-[10px] font-medium opacity-60 leading-tight">{item.desc}</div>
                  </div>
                  <ChevronRight size={16} className={`transition-all ${active ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* User Info Footer */}
        <div className="p-6 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center font-black">{user.name?.charAt(0)}</div>
             <div className="flex-1 min-w-0">
               <div className="text-sm font-black truncate">{user.name}</div>
               <div className="text-[10px] text-purple-400 font-bold uppercase">Administrador Master</div>
             </div>
             <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--muted)] hover:text-red-400 transition-colors">
               <LogOut size={18} />
             </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 min-h-screen flex flex-col relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-500/10 blur-[120px] rounded-full -mr-96 -mt-96 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[100px] rounded-full -ml-48 -mb-48 pointer-events-none" />

        {/* Mobile Header */}
        <header className="lg:hidden p-4 border-b border-white/5 bg-[#0a0a25]/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
          <div className="font-black text-xl tracking-tighter uppercase">ADMIN<span className="text-purple-500">PRO</span></div>
          <button onClick={handleLogout} className="p-2 rounded-lg bg-white/5 text-[var(--muted)]">
            <LogOut size={18} />
          </button>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 p-6 lg:p-12 relative z-10 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
