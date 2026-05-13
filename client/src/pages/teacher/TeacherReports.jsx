import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import api from '../../services/api'

export default function TeacherReports() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['teacher-reports'],
    queryFn: () => api.get('/teacher/reports').then(r => r.data)
  })

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Relatórios 📊</h1>
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div className="grid grid-cols-5 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] px-5 py-3"
          style={{ background: 'rgba(255,255,255,.03)', borderBottom: '1px solid var(--border)' }}>
          <span className="col-span-2">Aluno</span><span>Nível</span><span>XP</span><span>Atividades</span>
        </div>
        {isLoading
          ? [...Array(5)].map((_, i) => <div key={i} className="h-14 m-2 rounded-lg animate-pulse" style={{ background: 'var(--inp)' }}/>)
          : data.map((student, i) => (
            <motion.div key={student.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className="grid grid-cols-5 items-center px-5 py-3.5 border-b last:border-0"
              style={{ borderColor: 'var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.01)' }}>
              <div className="col-span-2 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                  style={{ background: 'var(--grad)' }}>{student.name?.charAt(0)}</div>
                <div className="font-medium text-sm truncate">{student.name}</div>
              </div>
              <span className="text-sm text-[var(--purple-l)] font-bold">{student.level}</span>
              <span className="text-sm text-[#a78bfa]">{student.xp?.toLocaleString('pt-BR')}</span>
              <span className="text-sm text-[var(--muted)]">{student._count?.submissions || 0}</span>
            </motion.div>
          ))
        }
        {!isLoading && data.length === 0 && (
          <div className="text-center py-16 text-[var(--muted)]">Nenhum aluno encontrado</div>
        )}
      </div>
    </div>
  )
}
