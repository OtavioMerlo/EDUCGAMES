import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Clock, Zap, ChevronRight, Filter } from 'lucide-react'
import api from '../../services/api'

const SUBJECTS = ['Todas', 'Matemática', 'Português', 'História', 'Biologia', 'Física', 'Inglês']
const DIFFICULTIES = { EASY: { label: 'Fácil', color: '#10b981' }, MEDIUM: { label: 'Médio', color: '#f59e0b' }, HARD: { label: 'Difícil', color: '#ef4444' } }
const TYPES = { QUIZ: '🧠 Quiz', TEXT: '📝 Texto', MULTIPLE_CHOICE: '✔️ Múltipla escolha', TRUE_FALSE: '⚖️ V ou F', UPLOAD: '📤 Upload' }

export default function ActivitiesPage() {
  const [subject, setSubject] = useState('')
  const [difficulty, setDifficulty] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['activities', subject, difficulty],
    queryFn: () => api.get('/activities', { params: { subject: subject || undefined, difficulty: difficulty || undefined } }).then(r => r.data)
  })

  const { data: mySubmissions } = useQuery({
    queryKey: ['my-submissions'],
    queryFn: () => api.get('/activities/my-submissions').then(r => r.data)
  })

  const submittedIds = new Set((mySubmissions || []).map(s => s.activityId))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Atividades 📚</h1>
          <p className="text-[var(--muted)] text-sm mt-0.5">Complete atividades e ganhe XP e moedas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-2 flex-wrap">
          {SUBJECTS.map(s => (
            <button key={s} onClick={() => setSubject(s === 'Todas' ? '' : s)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
              style={subject === (s === 'Todas' ? '' : s)
                ? { background: 'var(--grad)', color: '#fff', border: 'none', boxShadow: 'var(--glow-btn)' }
                : { background: 'var(--inp)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {Object.entries(DIFFICULTIES).map(([k, v]) => (
            <button key={k} onClick={() => setDifficulty(difficulty === k ? '' : k)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
              style={difficulty === k
                ? { background: v.color, color: '#fff', border: 'none' }
                : { background: 'var(--inp)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 rounded-xl animate-pulse" style={{ background: 'var(--inp)' }}/>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data?.activities || []).map((activity, i) => {
            const done = submittedIds.has(activity.id)
            const diff = DIFFICULTIES[activity.difficulty]
            return (
              <motion.div key={activity.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} whileHover={{ y: -3 }}>
                <Link to={`/activities/${activity.id}`}>
                  <div className={`p-5 rounded-xl h-full transition-all ${done ? 'opacity-70' : ''}`}
                    style={{ background: 'var(--inp)', border: `1px solid ${done ? '#10b981' : 'var(--border)'}` }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                          style={{ background: `${diff.color}22`, color: diff.color }}>
                          {diff.label}
                        </span>
                        <span className="text-xs text-[var(--muted)]">{TYPES[activity.type]}</span>
                      </div>
                      {done && <span className="text-[#10b981] text-lg">✓</span>}
                    </div>
                    <h3 className="font-semibold text-sm mb-1.5 line-clamp-2">{activity.title}</h3>
                    <p className="text-[var(--muted)] text-xs mb-4 line-clamp-2">{activity.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-1 rounded-full"
                        style={{ background: 'rgba(124,58,237,.15)', color: 'var(--purple-l)' }}>
                        {activity.subject}
                      </span>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-[#a78bfa] font-bold">+{activity.xpReward} XP</span>
                        <span className="text-[#fbbf24]">🪙 {activity.coinReward}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}

      {!isLoading && data?.activities?.length === 0 && (
        <div className="text-center py-20 text-[var(--muted)]">
          <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
          <div className="text-lg">Nenhuma atividade encontrada</div>
          <div className="text-sm mt-1">Tente outros filtros</div>
        </div>
      )}
    </div>
  )
}
