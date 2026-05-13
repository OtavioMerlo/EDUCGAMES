import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import api from '../../services/api'

export default function TeacherActivities() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['teacher-activities'],
    queryFn: () => api.get('/teacher/activities').then(r => r.data)
  })

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Minhas Atividades 📋</h1>
      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-xl animate-pulse" style={{ background: 'var(--inp)' }}/>)}</div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {data.map((act, i) => (
            <motion.div key={act.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl" style={{ background: 'var(--inp)', border: '1px solid var(--border)' }}>
              <div className="flex items-start justify-between mb-2">
                <div className="font-semibold text-sm">{act.title}</div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${act.isActive ? 'text-[#10b981]' : 'text-[#ef4444]'}`}
                  style={{ background: act.isActive ? 'rgba(16,185,129,.1)' : 'rgba(239,68,68,.1)' }}>
                  {act.isActive ? 'Ativa' : 'Inativa'}
                </span>
              </div>
              <div className="text-[var(--muted)] text-xs mb-3">{act.subject} • {act.difficulty} • {act.type}</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#a78bfa]">+{act.xpReward} XP • 🪙{act.coinReward}</span>
                <span className="text-[var(--muted)]">{act._count?.submissions || 0} respostas</span>
              </div>
            </motion.div>
          ))}
          {data.length === 0 && <div className="col-span-2 text-center py-16 text-[var(--muted)]">Nenhuma atividade criada ainda</div>}
        </div>
      )}
    </div>
  )
}
