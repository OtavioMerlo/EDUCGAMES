import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { motion } from 'framer-motion'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function GradingPage() {
  const qc = useQueryClient()
  const [filter, setFilter] = useState('PENDING')
  const [grading, setGrading] = useState({})

  const { data = [], isLoading } = useQuery({
    queryKey: ['teacher-submissions', filter],
    queryFn: () => api.get(`/teacher/submissions?status=${filter}`).then(r => r.data)
  })

  const gradeMutation = useMutation({
    mutationFn: ({ id, ...body }) => api.post(`/activities/submissions/${id}/grade`, body),
    onSuccess: () => { toast.success('Corrigido!'); qc.invalidateQueries(['teacher-submissions']) },
    onError: () => toast.error('Erro ao corrigir')
  })

  const filters = [
    { key: 'PENDING', label: '⏳ Pendentes' },
    { key: 'APPROVED', label: '✅ Aprovados' },
    { key: 'REJECTED', label: '❌ Reprovados' },
  ]

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Correções ✏️</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
            style={filter === f.key
              ? { background: 'var(--grad)', color: '#fff' }
              : { background: 'var(--inp)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {isLoading
          ? [...Array(3)].map((_, i) => <div key={i} className="h-40 rounded-xl animate-pulse" style={{ background: 'var(--inp)' }}/>)
          : data.map((sub, i) => (
            <motion.div key={sub.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl" style={{ background: 'var(--inp)', border: '1px solid var(--border)' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold">{sub.activity?.title}</div>
                  <div className="text-[var(--muted)] text-xs mt-0.5">
                    Aluno: <span className="text-[var(--text)]">{sub.user?.name}</span> • {new Date(sub.submittedAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                  style={{ color: sub.status === 'PENDING' ? '#f59e0b' : sub.status === 'APPROVED' ? '#10b981' : '#ef4444',
                    background: sub.status === 'PENDING' ? 'rgba(245,158,11,.1)' : sub.status === 'APPROVED' ? 'rgba(16,185,129,.1)' : 'rgba(239,68,68,.1)' }}>
                  {sub.status}
                </span>
              </div>
              {sub.answer && !sub.answer.startsWith('{') && (
                <div className="p-3 rounded-xl mb-3 text-sm text-[var(--muted)] italic"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)' }}>
                  {sub.answer}
                </div>
              )}
              {sub.status === 'PENDING' && (
                <div className="flex gap-2 flex-wrap mt-3">
                  <input type="number" min="0" max="100" placeholder="Nota (0-100)"
                    onChange={e => setGrading(g => ({ ...g, [sub.id]: { ...g[sub.id], score: e.target.value } }))}
                    className="p-2.5 rounded-lg text-sm outline-none w-32"
                    style={{ background: 'rgba(255,255,255,.04)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                  <input type="text" placeholder="Feedback (opcional)"
                    onChange={e => setGrading(g => ({ ...g, [sub.id]: { ...g[sub.id], feedback: e.target.value } }))}
                    className="flex-1 p-2.5 rounded-lg text-sm outline-none min-w-0"
                    style={{ background: 'rgba(255,255,255,.04)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                  <button onClick={() => gradeMutation.mutate({ id: sub.id, ...grading[sub.id], status: 'APPROVED' })}
                    className="px-4 py-2 rounded-lg text-sm font-bold text-white flex-shrink-0" style={{ background: '#10b981' }}>✅ Aprovar</button>
                  <button onClick={() => gradeMutation.mutate({ id: sub.id, ...grading[sub.id], status: 'REJECTED' })}
                    className="px-4 py-2 rounded-lg text-sm font-bold text-white flex-shrink-0" style={{ background: '#ef4444' }}>❌ Reprovar</button>
                </div>
              )}
            </motion.div>
          ))
        }
        {!isLoading && data.length === 0 && (
          <div className="text-center py-16 text-[var(--muted)]">Nenhuma submissão encontrada</div>
        )}
      </div>
    </div>
  )
}
