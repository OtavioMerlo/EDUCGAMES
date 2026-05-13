import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Send, CheckCircle, XCircle } from 'lucide-react'
import api from '../../services/api'
import useGameStore from '../../store/useGameStore'
import useAuthStore from '../../store/useAuthStore'
import toast from 'react-hot-toast'

const DIFF = {
  EASY: { label: 'Fácil', color: '#10b981' },
  MEDIUM: { label: 'Médio', color: '#f59e0b' },
  HARD: { label: 'Difícil', color: '#ef4444' }
}

export default function ActivityDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { triggerXpGain, triggerLevelUp } = useGameStore()
  const { updateUser, user } = useAuthStore()
  const [answers, setAnswers] = useState({})
  const [textAnswer, setTextAnswer] = useState('')
  const [result, setResult] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['activity', id],
    queryFn: () => api.get(`/activities/${id}`).then(r => r.data)
  })

  const submitMutation = useMutation({
    mutationFn: (payload) => api.post(`/activities/${id}/submit`, payload),
    onSuccess: ({ data: res }) => {
      setResult(res)
      if (res.xpAwarded > 0) {
        triggerXpGain(res.xpAwarded)
        const newXp = (user?.xp || 0) + res.xpAwarded
        const newLevel = Math.max(1, Math.floor(1 + Math.log(1 + newXp / 100) / Math.log(1.5)))
        if (newLevel > (user?.level || 1)) triggerLevelUp(newLevel)
        updateUser({ xp: newXp, coins: (user?.coins || 0) + res.coinsAwarded, level: newLevel })
      }
      toast.success(res.xpAwarded > 0 ? `+${res.xpAwarded} XP e +${res.coinsAwarded} moedas! 🎉` : 'Enviada para correção!')
      qc.invalidateQueries(['activities'])
      qc.invalidateQueries(['my-submissions'])
      qc.invalidateQueries(['me'])
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Erro ao enviar')
  })

  if (isLoading) return <div className="text-center py-20 text-[var(--muted)]">Carregando...</div>
  if (!data) return null

  const activity = data
  const content = (() => { try { return JSON.parse(activity.content || '{}') } catch { return {} } })()
  const diff = DIFF[activity.difficulty]
  const alreadySubmitted = !!activity.userSubmission || !!result

  const handleSubmit = () => {
    if (activity.type === 'TEXT') {
      if (!textAnswer.trim()) return toast.error('Escreva sua resposta!')
      submitMutation.mutate({ answer: textAnswer })
    } else {
      submitMutation.mutate({ answer: JSON.stringify(answers) })
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate('/activities')}
        className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--text)] transition-colors mb-6 text-sm">
        <ArrowLeft size={16} /> Voltar para atividades
      </button>

      {/* Info Card */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--inp)', border: '1px solid var(--border)' }}>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: `${diff.color}22`, color: diff.color }}>{diff.label}</span>
          <span className="px-3 py-1 rounded-full text-xs"
            style={{ background: 'rgba(124,58,237,.15)', color: 'var(--purple-l)' }}>{activity.subject}</span>
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">{activity.title}</h1>
        <p className="text-[var(--muted)] text-sm mb-4">{activity.description}</p>
        <div className="flex gap-4 text-sm">
          <span className="text-[#a78bfa] font-bold">+{activity.xpReward} XP</span>
          <span className="text-[#fbbf24]">🪙 +{activity.coinReward} moedas</span>
        </div>
      </div>

      {/* Result or Form */}
      {alreadySubmitted ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl p-8 text-center"
          style={{
            background: activity.userSubmission?.status === 'PENDING' ? 'rgba(245,158,11,.08)' :
              result?.score >= 60 || activity.userSubmission?.status === 'APPROVED' ? 'rgba(16,185,129,.08)' : 'rgba(239,68,68,.08)',
            border: `1px solid ${activity.userSubmission?.status === 'PENDING' ? '#f59e0b' :
              result?.score >= 60 || activity.userSubmission?.status === 'APPROVED' ? '#10b981' : '#ef4444'}44`
          }}>
          {activity.userSubmission?.status === 'PENDING'
            ? <div className="text-5xl mb-3">⏳</div>
            : result?.score >= 60 || activity.userSubmission?.status === 'APPROVED'
            ? <CheckCircle size={48} className="mx-auto mb-3 text-[#10b981]" />
            : <XCircle size={48} className="mx-auto mb-3 text-[#ef4444]" />}
          <div className="font-display text-2xl font-bold mb-2">
            {activity.userSubmission?.status === 'PENDING' ? 'Aguardando correção' :
             result?.score >= 60 || activity.userSubmission?.status === 'APPROVED' ? 'Atividade Aprovada! 🎉' : 'Tente novamente em breve'}
          </div>
          {result?.score !== undefined && (
            <div className="text-[var(--muted)]">Pontuação: <b className="text-[var(--text)]">{result.score}%</b></div>
          )}
          {result?.xpAwarded > 0 && (
            <div className="text-[#a78bfa] font-bold text-lg mt-2">+{result.xpAwarded} XP • 🪙 +{result.coinsAwarded}</div>
          )}
        </motion.div>
      ) : (
        <div className="rounded-2xl p-6" style={{ background: 'var(--inp)', border: '1px solid var(--border)' }}>
          <h2 className="font-display text-xl font-bold mb-5">Responder</h2>

          {['QUIZ', 'MULTIPLE_CHOICE'].includes(activity.type) && (
            <div className="flex flex-col gap-5">
              {(content.questions || []).map((q, qi) => (
                <div key={q.id}>
                  <p className="font-medium mb-3 text-sm">{qi + 1}. {q.text}</p>
                  <div className="flex flex-col gap-2">
                    {q.options.map(opt => (
                      <button key={opt} onClick={() => setAnswers(a => ({ ...a, [q.id]: opt }))}
                        className="text-left px-4 py-3 rounded-xl text-sm transition-all"
                        style={{
                          background: answers[q.id] === opt ? 'rgba(124,58,237,.25)' : 'rgba(255,255,255,.03)',
                          border: `1px solid ${answers[q.id] === opt ? 'rgba(168,85,247,.6)' : 'var(--border)'}`
                        }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activity.type === 'TRUE_FALSE' && (
            <div className="flex flex-col gap-5">
              {(content.statements || []).map((s, si) => (
                <div key={s.id}>
                  <p className="font-medium mb-3 text-sm">{si + 1}. {s.text}</p>
                  <div className="flex gap-3">
                    {['Verdadeiro', 'Falso'].map(opt => {
                      const isTrue = opt === 'Verdadeiro'
                      const selected = answers[s.id] === isTrue
                      return (
                        <button key={opt} onClick={() => setAnswers(a => ({ ...a, [s.id]: isTrue }))}
                          className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                          style={{
                            background: selected ? (isTrue ? 'rgba(16,185,129,.25)' : 'rgba(239,68,68,.25)') : 'rgba(255,255,255,.03)',
                            border: `1px solid ${selected ? (isTrue ? '#10b981' : '#ef4444') : 'var(--border)'}`
                          }}>
                          {isTrue ? '✅' : '❌'} {opt}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activity.type === 'TEXT' && (
            <div>
              {content.text && (
                <div className="p-4 rounded-xl mb-4 text-sm text-[var(--muted)] italic"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)' }}>
                  {content.text}
                </div>
              )}
              <p className="font-medium mb-3 text-sm">{content.question}</p>
              <textarea value={textAnswer} onChange={e => setTextAnswer(e.target.value)}
                rows={6} placeholder="Escreva sua resposta aqui..."
                className="w-full p-4 rounded-xl text-sm resize-none outline-none transition-colors"
                style={{
                  background: 'rgba(255,255,255,.04)', border: '1px solid var(--border)',
                  color: 'var(--text)', fontFamily: "'Exo 2', sans-serif"
                }} />
            </div>
          )}

          <button onClick={handleSubmit} disabled={submitMutation.isPending} className="btn-primary mt-6 flex items-center justify-center gap-2">
            <Send size={16} />
            {submitMutation.isPending ? 'Enviando...' : 'Enviar Resposta'}
          </button>
        </div>
      )}
    </div>
  )
}
