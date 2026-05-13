import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const TYPES = ['QUIZ', 'TEXT', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'UPLOAD']
const TYPE_LABELS = { QUIZ: '🧠 Quiz', TEXT: '📝 Texto', MULTIPLE_CHOICE: '✔️ Múltipla escolha', TRUE_FALSE: '⚖️ Verdadeiro/Falso', UPLOAD: '📤 Upload' }
const DIFFS = ['EASY', 'MEDIUM', 'HARD']
const DIFF_LABELS = { EASY: 'Fácil', MEDIUM: 'Médio', HARD: 'Difícil' }
const SUBJECTS = ['Matemática', 'Português', 'História', 'Biologia', 'Física', 'Inglês', 'Química', 'Geografia', 'Arte', 'Educação Física']

export default function CreateActivity() {
  const navigate = useNavigate()
  const [actType, setActType] = useState('QUIZ')
  const [questions, setQuestions] = useState([{ id: '1', text: '', options: ['', '', '', ''], correctAnswer: '' }])
  const [statements, setStatements] = useState([{ id: '1', text: '', correct: true }])
  const { register, handleSubmit, watch } = useForm({ defaultValues: { difficulty: 'EASY', xpReward: 25, coinReward: 12, subject: 'Matemática' } })

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/activities', data),
    onSuccess: () => { toast.success('Atividade criada com sucesso!'); navigate('/teacher/activities') },
    onError: (err) => toast.error(err.response?.data?.error || 'Erro ao criar atividade')
  })

  const addQuestion = () => setQuestions(q => [...q, { id: String(Date.now()), text: '', options: ['', '', '', ''], correctAnswer: '' }])
  const removeQuestion = (id) => setQuestions(q => q.filter(x => x.id !== id))
  const updateQuestion = (id, field, value) => setQuestions(q => q.map(x => x.id === id ? { ...x, [field]: value } : x))
  const updateOption = (qId, idx, value) => setQuestions(q => q.map(x => x.id === qId ? { ...x, options: x.options.map((o, i) => i === idx ? value : o) } : x))

  const onSubmit = (data) => {
    let content = {}
    if (actType === 'QUIZ' || actType === 'MULTIPLE_CHOICE') content = { questions }
    else if (actType === 'TRUE_FALSE') content = { statements }
    else if (actType === 'TEXT') content = { text: data.contextText || '', question: data.question || '' }
    else content = { instructions: data.instructions || '' }

    createMutation.mutate({
      title: data.title, description: data.description, type: actType,
      difficulty: data.difficulty, subject: data.subject,
      xpReward: Number(data.xpReward), coinReward: Number(data.coinReward),
      content: JSON.stringify(content),
    })
  }

  const inputCls = "w-full p-3 rounded-xl text-sm outline-none transition-colors"
  const inputStyle = { background: 'rgba(255,255,255,.04)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: "'Exo 2',sans-serif" }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-3xl font-bold mb-6">Criar Atividade ✏️</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Basic info */}
        <div className="p-6 rounded-2xl" style={{ background: 'var(--inp)', border: '1px solid var(--border)' }}>
          <h2 className="font-display text-lg font-bold mb-4">Informações Básicas</h2>
          <div className="grid gap-4">
            <div>
              <label className="text-[11px] text-[var(--muted)] font-bold uppercase tracking-wider mb-1.5 block">Título</label>
              <input type="text" {...register('title', { required: true })} placeholder="Título da atividade" className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className="text-[11px] text-[var(--muted)] font-bold uppercase tracking-wider mb-1.5 block">Descrição</label>
              <textarea {...register('description', { required: true })} rows={2} placeholder="Descreva a atividade..." className={`${inputCls} resize-none`} style={inputStyle} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-[var(--muted)] font-bold uppercase tracking-wider mb-1.5 block">Matéria</label>
                <select {...register('subject')} className={inputCls} style={inputStyle}>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-[var(--muted)] font-bold uppercase tracking-wider mb-1.5 block">Dificuldade</label>
                <select {...register('difficulty')} className={inputCls} style={inputStyle}>
                  {DIFFS.map(d => <option key={d} value={d}>{DIFF_LABELS[d]}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-[var(--muted)] font-bold uppercase tracking-wider mb-1.5 block">XP</label>
                <input type="number" {...register('xpReward')} className={inputCls} style={inputStyle} />
              </div>
              <div>
                <label className="text-[11px] text-[var(--muted)] font-bold uppercase tracking-wider mb-1.5 block">Moedas</label>
                <input type="number" {...register('coinReward')} className={inputCls} style={inputStyle} />
              </div>
            </div>
          </div>
        </div>

        {/* Type selector */}
        <div className="p-6 rounded-2xl" style={{ background: 'var(--inp)', border: '1px solid var(--border)' }}>
          <h2 className="font-display text-lg font-bold mb-4">Tipo de Atividade</h2>
          <div className="flex flex-wrap gap-2">
            {TYPES.map(t => (
              <button key={t} type="button" onClick={() => setActType(t)}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={actType === t
                  ? { background: 'var(--grad)', color: '#fff', boxShadow: 'var(--glow-btn)' }
                  : { background: 'rgba(255,255,255,.04)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
                {TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on type */}
        {(actType === 'QUIZ' || actType === 'MULTIPLE_CHOICE') && (
          <div className="p-6 rounded-2xl" style={{ background: 'var(--inp)', border: '1px solid var(--border)' }}>
            <h2 className="font-display text-lg font-bold mb-4">Questões</h2>
            {questions.map((q, qi) => (
              <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)' }}>
                <div className="flex gap-2 mb-3">
                  <input type="text" placeholder={`Questão ${qi + 1}`} value={q.text}
                    onChange={e => updateQuestion(q.id, 'text', e.target.value)}
                    className={`${inputCls} flex-1`} style={inputStyle} />
                  {questions.length > 1 && (
                    <button type="button" onClick={() => removeQuestion(q.id)} className="p-2 rounded-lg text-[#ef4444] hover:bg-red-500/10">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-2 mb-3">
                  {q.options.map((opt, oi) => (
                    <input key={oi} type="text" placeholder={`Opção ${oi + 1}`} value={opt}
                      onChange={e => updateOption(q.id, oi, e.target.value)}
                      className={inputCls} style={inputStyle} />
                  ))}
                </div>
                <select value={q.correctAnswer} onChange={e => updateQuestion(q.id, 'correctAnswer', e.target.value)}
                  className={inputCls} style={{ ...inputStyle, borderColor: q.correctAnswer ? '#10b981' : 'var(--border)' }}>
                  <option value="">Selecione a resposta correta</option>
                  {q.options.filter(Boolean).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </motion.div>
            ))}
            <button type="button" onClick={addQuestion}
              className="flex items-center gap-2 text-sm text-[var(--purple-l)] hover:text-[var(--pink)] transition-colors font-semibold">
              <Plus size={16} /> Adicionar questão
            </button>
          </div>
        )}

        {actType === 'TRUE_FALSE' && (
          <div className="p-6 rounded-2xl" style={{ background: 'var(--inp)', border: '1px solid var(--border)' }}>
            <h2 className="font-display text-lg font-bold mb-4">Afirmações</h2>
            {statements.map((s, si) => (
              <div key={s.id} className="flex gap-3 mb-3">
                <input type="text" placeholder={`Afirmação ${si + 1}`} value={s.text}
                  onChange={e => setStatements(st => st.map(x => x.id === s.id ? { ...x, text: e.target.value } : x))}
                  className={`${inputCls} flex-1`} style={inputStyle} />
                <select value={s.correct ? 'true' : 'false'}
                  onChange={e => setStatements(st => st.map(x => x.id === s.id ? { ...x, correct: e.target.value === 'true' } : x))}
                  className={inputCls} style={{ ...inputStyle, width: 'auto' }}>
                  <option value="true">✅ Verdadeiro</option>
                  <option value="false">❌ Falso</option>
                </select>
              </div>
            ))}
            <button type="button" onClick={() => setStatements(s => [...s, { id: String(Date.now()), text: '', correct: true }])}
              className="flex items-center gap-2 text-sm text-[var(--purple-l)] font-semibold">
              <Plus size={16} /> Adicionar afirmação
            </button>
          </div>
        )}

        {actType === 'TEXT' && (
          <div className="p-6 rounded-2xl" style={{ background: 'var(--inp)', border: '1px solid var(--border)' }}>
            <h2 className="font-display text-lg font-bold mb-4">Conteúdo</h2>
            <div className="mb-4">
              <label className="text-[11px] text-[var(--muted)] font-bold uppercase tracking-wider mb-1.5 block">Texto de contexto (opcional)</label>
              <textarea {...register('contextText')} rows={4} placeholder="Texto que o aluno vai ler..." className={`${inputCls} resize-none`} style={inputStyle} />
            </div>
            <div>
              <label className="text-[11px] text-[var(--muted)] font-bold uppercase tracking-wider mb-1.5 block">Pergunta / Enunciado</label>
              <textarea {...register('question')} rows={3} placeholder="O que o aluno deve responder?" className={`${inputCls} resize-none`} style={inputStyle} />
            </div>
          </div>
        )}

        <button type="submit" disabled={createMutation.isPending} className="btn-primary">
          {createMutation.isPending ? 'Criando...' : '✅ Criar Atividade'}
        </button>
      </form>
    </div>
  )
}
