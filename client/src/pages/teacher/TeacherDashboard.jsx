import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Plus, CheckSquare, BookOpen, Users } from 'lucide-react'
import api from '../../services/api'

export default function TeacherDashboard() {
  const { data } = useQuery({
    queryKey: ['teacher-dashboard'],
    queryFn: () => api.get('/teacher/dashboard').then(r => r.data)
  })

  const stats = [
    { icon: BookOpen, label: 'Minhas Atividades', value: data?.myActivities || 0, color: '#a78bfa' },
    { icon: CheckSquare, label: 'Correções Pendentes', value: data?.pendingSubmissions || 0, color: '#f59e0b' },
    { icon: Users, label: 'Alunos Ativos', value: data?.totalStudents || 0, color: '#22d3ee' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Dashboard do Professor 👨‍🏫</h1>
          <p className="text-[var(--muted)] text-sm mt-0.5">Gerencie suas atividades e alunos</p>
        </div>
        <Link to="/teacher/create">
          <button className="btn-primary flex items-center gap-2" style={{ width: 'auto', padding: '10px 20px', fontSize: 14 }}>
            <Plus size={16} /> Nova Atividade
          </button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl" style={{ background: 'var(--inp)', border: '1px solid var(--border)' }}>
            <Icon size={24} style={{ color }} className="mb-3" />
            <div className="font-display text-3xl font-bold mb-1" style={{ color }}>{value}</div>
            <div className="text-[var(--muted)] text-sm">{label}</div>
          </motion.div>
        ))}
      </div>

      <h2 className="font-display text-lg font-bold mb-4">Atividades Recentes</h2>
      <div className="flex flex-col gap-3">
        {(data?.recentActivities || []).map((act, i) => (
          <motion.div key={act.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--inp)', border: '1px solid var(--border)' }}>
            <div className="flex-1">
              <div className="font-semibold text-sm">{act.title}</div>
              <div className="text-[var(--muted)] text-xs mt-0.5">{act.subject} • {act.difficulty}</div>
            </div>
            <div className="text-right text-xs text-[var(--muted)]">{act._count?.submissions || 0} respostas</div>
          </motion.div>
        ))}
        {(!data?.recentActivities || data.recentActivities.length === 0) && (
          <div className="text-center py-10 text-[var(--muted)]">
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <div>Nenhuma atividade criada ainda.</div>
            <Link to="/teacher/create" className="text-[var(--purple-l)] font-semibold mt-2 inline-block">Criar primeira atividade →</Link>
          </div>
        )}
      </div>
    </div>
  )
}
