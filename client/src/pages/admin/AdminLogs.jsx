import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import api from '../../services/api'

export default function AdminLogs() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['admin-logs'],
    queryFn: () => api.get('/admin/logs').then(r => r.data)
  })

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Logs do Sistema 📋</h1>
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div className="grid grid-cols-4 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] px-5 py-3"
          style={{ background: 'rgba(255,255,255,.03)', borderBottom: '1px solid var(--border)' }}>
          <span>Ação</span><span>Usuário</span><span>Entidade</span><span>Data</span>
        </div>
        {isLoading
          ? [...Array(8)].map((_, i) => <div key={i} className="h-12 m-2 rounded animate-pulse" style={{ background: 'var(--inp)' }}/>)
          : data.map((log, i) => (
            <motion.div key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
              className="grid grid-cols-4 items-center px-5 py-3 border-b last:border-0 text-sm"
              style={{ borderColor: 'var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.01)' }}>
              <span className="font-medium text-[var(--purple-l)]">{log.action}</span>
              <span className="text-[var(--muted)] text-xs truncate">{log.userId?.slice(0, 8)}...</span>
              <span className="text-[var(--muted)] text-xs">{log.entity || '–'}</span>
              <span className="text-[var(--muted)] text-xs">{new Date(log.createdAt).toLocaleString('pt-BR')}</span>
            </motion.div>
          ))
        }
        {!isLoading && data.length === 0 && <div className="text-center py-12 text-[var(--muted)]">Nenhum log encontrado</div>}
      </div>
    </div>
  )
}
