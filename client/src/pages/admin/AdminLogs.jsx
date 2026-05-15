import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ScrollText, Search, Filter, Calendar, 
  Clock, User, Shield, Info, ArrowDownRight,
  ChevronLeft, ChevronRight, Download
} from 'lucide-react'
import api from '../../services/api'
import Skeleton from '../../components/ui/Skeleton'

const ACTION_COLORS = {
  UPDATE_USER: { color: '#a78bfa', icon: User },
  DELETE_USER: { color: '#f43f5e', icon: Shield },
  CREATE_REWARD: { color: '#fbbf24', icon: ArrowDownRight },
  UPDATE_REWARD: { color: '#22d3ee', icon: Info },
  AUTH_LOGIN: { color: '#10b981', icon: Shield },
  DEFAULT: { color: '#64748b', icon: ScrollText }
}

export default function AdminLogs() {
  const [page, setPage] = useState(1)
  const [actionFilter, setActionFilter] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-logs', page, actionFilter],
    queryFn: () => api.get(`/admin/logs?page=${page}&action=${actionFilter}`).then(r => r.data),
    placeholderData: (prev) => prev
  })

  const logs = data?.logs || []

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-1 flex items-center gap-3">
             <ScrollText size={32} className="text-purple-400" />
             Auditoria
          </h1>
          <p className="text-[var(--muted)] font-medium">Registro completo de ações administrativas e eventos do sistema.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-[var(--muted)] hover:text-white transition-all text-xs font-black uppercase tracking-widest border border-white/10">
            <Download size={16} />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-3xl glass border border-white/10">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          <button onClick={() => setActionFilter('')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!actionFilter ? 'bg-purple-500 text-white' : 'bg-white/5 text-[var(--muted)]'}`}>Todos</button>
          {['UPDATE_USER', 'DELETE_USER', 'CREATE_REWARD', 'AUTH_LOGIN'].map(act => (
            <button key={act} onClick={() => setActionFilter(act)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${actionFilter === act ? 'bg-purple-500 text-white' : 'bg-white/5 text-[var(--muted)]'}`}>
              {act.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline View */}
      <div className="space-y-4">
        {isLoading ? (
          [...Array(6)].map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)
        ) : logs.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center opacity-40">
            <ScrollText size={64} className="mb-4" />
            <p className="font-bold">Nenhum registro encontrado</p>
          </div>
        ) : (
          logs.map((log, i) => {
            const config = ACTION_COLORS[log.action] || ACTION_COLORS.DEFAULT
            const Icon = config.icon
            return (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative flex items-start gap-6 p-6 rounded-3xl glass border border-white/10 hover:border-white/20 transition-all"
              >
                {/* Timeline Line */}
                {i < logs.length - 1 && (
                  <div className="absolute left-10 top-20 bottom-0 w-0.5 bg-white/5 -z-10" />
                )}

                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg" 
                  style={{ background: `${config.color}20`, border: `1px solid ${config.color}30`, color: config.color }}>
                  <Icon size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-white uppercase tracking-widest">{log.action}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="text-[10px] font-bold text-[var(--muted)] uppercase flex items-center gap-1">
                        <User size={12} /> {log.user?.name || 'Sistema'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">
                       <span className="flex items-center gap-1"><Clock size={12} /> {new Date(log.createdAt).toLocaleTimeString()}</span>
                       <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(log.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-[var(--muted)] mb-3">{log.details || 'Nenhum detalhe adicional.'}</p>

                  <div className="flex flex-wrap items-center gap-4">
                    {log.entity && (
                      <div className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-black text-[var(--muted)] uppercase tracking-widest border border-white/5">
                        ENTIDADE: {log.entity}
                      </div>
                    )}
                    {log.ip && (
                      <div className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-black text-[var(--muted)] uppercase tracking-widest border border-white/5">
                        IP: {log.ip}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-8">
        <p className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">
          Página {page} de {Math.ceil((data?.total || 0) / 50)}
        </p>
        <div className="flex items-center gap-3">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => setPage(p => p + 1)} disabled={logs.length < 50}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
