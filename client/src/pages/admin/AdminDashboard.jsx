import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Users, BookOpen, ShoppingBag, Activity } from 'lucide-react'
import api from '../../services/api'

export default function AdminDashboard() {
  const { data } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then(r => r.data)
  })

  const stats = [
    { icon: Users, label: 'Total de Usuários', value: data?.stats.totalUsers || 0, sub: `${data?.stats.totalStudents || 0} alunos`, color: '#a78bfa' },
    { icon: BookOpen, label: 'Atividades', value: data?.stats.totalActivities || 0, sub: `${data?.stats.totalSubmissions || 0} submissões`, color: '#22d3ee' },
    { icon: ShoppingBag, label: 'Compras', value: data?.stats.totalPurchases || 0, sub: `${data?.stats.totalRewards || 0} recompensas`, color: '#fbbf24' },
    { icon: Activity, label: 'Moedas em Circulação', value: (data?.coinsInCirculation || 0).toLocaleString('pt-BR'), sub: `${(data?.totalCoinsSpent || 0).toLocaleString('pt-BR')} gastas`, color: '#f59e0b' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">Dashboard Admin 🛡️</h1>
        <p className="text-[var(--muted)] text-sm mt-0.5">Visão geral do sistema EducaGames</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, sub, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="p-5 rounded-2xl" style={{ background: 'var(--inp)', border: `1px solid ${color}33` }}>
            <Icon size={20} style={{ color }} className="mb-3" />
            <div className="font-display text-3xl font-bold mb-1" style={{ color }}>{value}</div>
            <div className="text-sm font-semibold mb-0.5">{label}</div>
            <div className="text-[var(--muted)] text-xs">{sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Students */}
        <div>
          <h2 className="font-display text-lg font-bold mb-4">Top Alunos</h2>
          <div className="flex flex-col gap-2">
            {(data?.topStudents || []).map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 p-3.5 rounded-xl"
                style={{ background: 'var(--inp)', border: '1px solid var(--border)' }}>
                <span className="font-display text-base font-bold w-6 text-center"
                  style={{ color: i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : i === 2 ? '#d97706' : 'var(--muted)' }}>
                  {i + 1}
                </span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ background: s.avatarColor || 'var(--grad)' }}>{s.name?.charAt(0)}</div>
                <div className="flex-1"><div className="text-sm font-semibold">{s.name}</div><div className="text-[11px] text-[var(--muted)]">Nível {s.level}</div></div>
                <span className="text-sm font-bold text-[#a78bfa]">{s.xp?.toLocaleString('pt-BR')} XP</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div>
          <h2 className="font-display text-lg font-bold mb-4">Novos Usuários</h2>
          <div className="flex flex-col gap-2">
            {(data?.recentUsers || []).map((u, i) => (
              <div key={u.id} className="flex items-center gap-3 p-3.5 rounded-xl"
                style={{ background: 'var(--inp)', border: '1px solid var(--border)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ background: u.role === 'ADMIN' ? 'var(--grad)' : u.role === 'TEACHER' ? 'rgba(34,211,238,.3)' : 'rgba(168,85,247,.3)' }}>
                  {u.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{u.name}</div>
                  <div className="text-[11px] text-[var(--muted)]">{u.email}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ color: u.role === 'ADMIN' ? '#a78bfa' : u.role === 'TEACHER' ? '#22d3ee' : '#10b981',
                    background: u.role === 'ADMIN' ? 'rgba(167,139,250,.1)' : u.role === 'TEACHER' ? 'rgba(34,211,238,.1)' : 'rgba(16,185,129,.1)' }}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
