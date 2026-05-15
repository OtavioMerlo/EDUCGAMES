import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  Users, BookOpen, ShoppingBag, Activity, 
  TrendingUp, TrendingDown, Coins, Zap, 
  ArrowUpRight, Clock, ShieldCheck
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts'
import api from '../../services/api'
import Skeleton from '../../components/ui/Skeleton'

const StatCard = ({ icon: Icon, label, value, sub, color, trend }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="relative p-6 rounded-3xl overflow-hidden glass border border-white/10"
  >
    {/* Background Glow */}
    <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 -mr-16 -mt-16" style={{ background: color }} />
    
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 rounded-2xl bg-white/5 border border-white/5" style={{ color }}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black ${trend > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>

    <div className="space-y-1">
      <div className="text-3xl font-black text-white tracking-tight">{value}</div>
      <div className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider">{label}</div>
      <div className="text-[10px] font-medium text-[var(--muted)] opacity-60 uppercase">{sub}</div>
    </div>
  </motion.div>
)

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then(r => r.data)
  })

  if (isLoading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-44 rounded-3xl" />)}
    </div>
  )

  const stats = [
    { icon: Users, label: 'Alunos Ativos', value: data?.stats?.totalStudents || 0, sub: 'Total de usuários registrados', color: '#a78bfa', trend: 12 },
    { icon: BookOpen, label: 'Atividades', value: data?.stats?.totalActivities || 0, sub: `${data?.stats?.totalSubmissions || 0} submissões totais`, color: '#22d3ee', trend: 5 },
    { icon: Coins, label: 'Economia', value: (data?.economy?.circulating || 0).toLocaleString('pt-BR'), sub: 'Moedas em circulação', color: '#fbbf24', trend: -2 },
    { icon: Zap, label: 'XP Gerado', value: '45.2k', sub: 'Total de XP ganho hoje', color: '#f43f5e', trend: 8 },
  ]

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-1">Painel Geral</h1>
          <p className="text-[var(--muted)] font-medium">Bem-vindo ao centro de controle da EducaGames.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-black uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Sistema Online
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[var(--muted)] text-xs font-bold">
            v2.4.0-pro
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Growth Chart */}
        <div className="lg:col-span-2 p-8 rounded-3xl glass border border-white/10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black text-white">Crescimento de Alunos</h2>
              <p className="text-xs text-[var(--muted)] uppercase font-bold tracking-widest mt-1">Últimos 30 dias</p>
            </div>
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <ArrowUpRight size={20} className="text-purple-400" />
            </button>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.chartData || []}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  itemStyle={{ color: '#a78bfa', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#a78bfa" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Widgets */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[40px] -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-black uppercase text-xs tracking-widest mb-4 opacity-80">Segurança</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white/90">Tentativas de Login</span>
                <span className="text-lg font-black text-white">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white/90">IPs Bloqueados</span>
                <span className="text-lg font-black text-white">2</span>
              </div>
              <div className="pt-2">
                <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black uppercase tracking-widest transition-colors">
                  Ver Relatório
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity Mini-list */}
          <div className="p-6 rounded-3xl glass border border-white/10">
            <h3 className="text-white font-black uppercase text-xs tracking-widest mb-4">Novos Cadastros</h3>
            <div className="space-y-3">
              {(data?.recentUsers || []).slice(0, 4).map(u => (
                <div key={u.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black border border-white/5">
                    {u.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black text-white truncate">{u.name}</div>
                    <div className="text-[9px] text-[var(--muted)] uppercase font-bold">{new Date(u.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Store Performance (Mock) */}
        <div className="p-8 rounded-3xl glass border border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag size={18} className="text-yellow-400" />
            <h2 className="text-xl font-black text-white">Popularidade de Itens</h2>
          </div>
          <div className="h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={[
                 { name: 'Auras', val: 45 },
                 { name: 'Efeitos', val: 32 },
                 { name: 'Badges', val: 68 },
                 { name: 'Skins', val: 24 },
                 { name: 'Passes', val: 12 },
               ]}>
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                 <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />
                 <Bar dataKey="val" radius={[6, 6, 0, 0]}>
                    {[...Array(5)].map((_, i) => (
                      <Cell key={i} fill={['#a78bfa', '#fbbf24', '#22d3ee', '#f43f5e', '#10b981'][i]} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* System Logs Preview */}
        <div className="p-8 rounded-3xl glass border border-white/10">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2">
               <ShieldCheck size={18} className="text-green-400" />
               <h2 className="text-xl font-black text-white">Ações Recentes</h2>
             </div>
             <button className="text-[10px] font-black text-purple-400 uppercase tracking-widest hover:text-purple-300">Ver Tudo</button>
          </div>
          <div className="space-y-4">
             {[
               { type: 'AUTH', action: 'Login Administrativo', time: '2m atrás', user: 'Admin' },
               { type: 'STORE', action: 'Item "Aura Neon" criado', time: '15m atrás', user: 'Admin' },
               { type: 'USER', action: 'Usuário "Otávio" banido', time: '1h atrás', user: 'Moderator' },
               { type: 'SYS', action: 'Backup concluído', time: '3h atrás', user: 'System' },
             ].map((log, i) => (
               <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors cursor-default">
                 <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-[10px] font-black text-purple-400 group-hover:scale-110 transition-transform">
                   {log.type}
                 </div>
                 <div className="flex-1 min-w-0">
                   <div className="text-xs font-black text-white">{log.action}</div>
                   <div className="text-[10px] text-[var(--muted)] font-bold">{log.user} • {log.time}</div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  )
}
