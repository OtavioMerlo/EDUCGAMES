import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import api from '../../services/api'

const STATUS = {
  PENDING: { label: 'Pendente', color: '#f59e0b', bg: 'rgba(245,158,11,.1)' },
  APPROVED: { label: 'Aprovado', color: '#10b981', bg: 'rgba(16,185,129,.1)' },
  REJECTED: { label: 'Reprovado', color: '#ef4444', bg: 'rgba(239,68,68,.1)' },
  GRADED: { label: 'Corrigido', color: '#60a5fa', bg: 'rgba(96,165,250,.1)' },
}

export default function HistoryPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['my-submissions'],
    queryFn: () => api.get('/activities/my-submissions').then(r => r.data)
  })

  const { data: purchases = [] } = useQuery({
    queryKey: ['my-purchases'],
    queryFn: () => api.get('/rewards/my-purchases').then(r => r.data)
  })

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Histórico 📋</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activities */}
        <div>
          <h2 className="font-display text-lg font-bold mb-4">Atividades ({data.length})</h2>
          <div className="flex flex-col gap-3">
            {isLoading
              ? [...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'var(--inp)' }}/>)
              : data.map((sub, i) => {
                const s = STATUS[sub.status]
                return (
                  <motion.div key={sub.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 p-4 rounded-xl"
                    style={{ background: 'var(--inp)', border: '1px solid var(--border)' }}>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{sub.activity?.title}</div>
                      <div className="text-[var(--muted)] text-xs">{sub.activity?.subject} • {new Date(sub.submittedAt).toLocaleDateString('pt-BR')}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                        style={{ background: s.bg, color: s.color }}>{s.label}</span>
                      {sub.xpAwarded > 0 && <span className="text-[11px] text-[#a78bfa]">+{sub.xpAwarded} XP</span>}
                    </div>
                  </motion.div>
                )
              })
            }
            {!isLoading && data.length === 0 && (
              <div className="text-center py-10 text-[var(--muted)]">Nenhuma atividade enviada ainda</div>
            )}
          </div>
        </div>

        {/* Purchases */}
        <div>
          <h2 className="font-display text-lg font-bold mb-4">Compras ({purchases.length})</h2>
          <div className="flex flex-col gap-3">
            {purchases.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{ background: 'var(--inp)', border: '1px solid var(--border)' }}>
                <span className="text-2xl flex-shrink-0">{p.reward?.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{p.reward?.title}</div>
                  <div className="text-[var(--muted)] text-xs">{new Date(p.createdAt).toLocaleDateString('pt-BR')}</div>
                </div>
                <span className="text-sm font-bold text-[#fbbf24] flex-shrink-0">🪙 -{p.coinsSpent}</span>
              </motion.div>
            ))}
            {purchases.length === 0 && (
              <div className="text-center py-10 text-[var(--muted)]">Nenhuma compra realizada ainda</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
