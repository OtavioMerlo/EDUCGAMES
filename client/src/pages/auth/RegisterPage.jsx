import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User, ChevronLeft, ChevronRight, Shield } from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: 'Senhas não conferem', path: ['confirmPassword'] })

const strengthLabels = ['', 'Fraca', 'Razoável', 'Boa', 'Forte']
const strengthColors = ['', '#ef4444', '#f59e0b', '#10b981', '#10b981']

const getStrength = (pw) => {
  let s = 0
  if (pw.length >= 6) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [showPw, setShowPw] = useState(false)
  const [showCPw, setShowCPw] = useState(false)
  const { register: registerUser, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, watch, trigger, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
  const pw = watch('password', '')
  const strength = getStrength(pw)

  const nextStep = async () => {
    const fields = step === 1 ? ['name', 'email'] : ['password', 'confirmPassword']
    const ok = await trigger(fields)
    if (ok) setStep(s => s + 1)
  }

  const onSubmit = async (data) => {
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password })
      toast.success('Conta criada! Bem-vindo ao EducaGames 🚀')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao criar conta')
      setStep(1)
    }
  }

  const steps = ['Dados', 'Senha', 'Confirmação']

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--bg)' }}>
      <div className="blobs"><div className="blob b1"/><div className="blob b2"/><div className="blob b3"/></div>
      <div className="bg-grid"/>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-md">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-16 h-16 mb-3 animate-float">
            <div className="logo-ring"/>
            <div className="relative w-full h-full rounded-2xl flex items-center justify-center" style={{ background: 'var(--bg2)' }}>
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
                <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#a855f7"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs>
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="url(#rg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="url(#rg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="font-display text-2xl font-bold tracking-widest mb-1">
            <span className="text-[var(--text)]">EDUCA</span><span className="grad-text">GAMES</span>
          </div>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-7">
            {step > 1 && (
              <button type="button" onClick={() => setStep(s => s - 1)}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
                style={{ background: 'var(--inp)', border: '1px solid var(--border)' }}>
                <ChevronLeft size={16} />
              </button>
            )}
            <div>
              <h1 className="font-display text-3xl font-bold grad-text">Criar Conta</h1>
              <p className="text-[var(--muted)] text-sm">Vamos começar sua jornada!</p>
            </div>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center mb-7">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-300 ${
                  step > i + 1 ? 'border-2 border-[var(--purple-l)] text-[var(--purple-l)]' :
                  step === i + 1 ? 'shadow-glow text-white' : 'text-[var(--hint)]'
                }`} style={step === i + 1 ? { background: 'var(--grad)' } : step > i + 1 ? { background: 'rgba(124,58,237,.25)' } : { background: 'var(--inp)', border: '1.5px solid var(--border)' }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-1.5 rounded overflow-hidden" style={{ background: 'var(--border)' }}>
                    <motion.div className="h-full rounded"
                      style={{ background: 'var(--grad)' }}
                      animate={{ width: step > i + 1 ? '100%' : '0%' }}
                      transition={{ duration: 0.4 }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-3.5">
                  <div>
                    <label className="text-[11px] text-[var(--muted)] font-bold uppercase tracking-wider mb-1.5 block">Nome completo</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--hint)]" />
                      <input type="text" placeholder="Seu nome completo" {...register('name')} className="input-field" />
                    </div>
                    {errors.name && <p className="text-[#ef4444] text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="text-[11px] text-[var(--muted)] font-bold uppercase tracking-wider mb-1.5 block">E-mail</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--hint)]" />
                      <input type="email" placeholder="seu@email.com" {...register('email')} className="input-field" />
                    </div>
                    {errors.email && <p className="text-[#ef4444] text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <button type="button" onClick={nextStep} className="btn-primary mt-1">CONTINUAR →</button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-3.5">
                  <div>
                    <label className="text-[11px] text-[var(--muted)] font-bold uppercase tracking-wider mb-1.5 block">Senha</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--hint)]" />
                      <input type={showPw ? 'text' : 'password'} placeholder="Mínimo 6 caracteres" {...register('password')} className="input-field pr-12" />
                      <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--hint)] hover:text-[var(--purple-l)] transition-colors">
                        {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                      </button>
                    </div>
                    {pw && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1.5">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="flex-1 h-1 rounded-full transition-colors duration-300"
                              style={{ background: i <= strength ? strengthColors[strength] : 'var(--border)' }}/>
                          ))}
                        </div>
                        <p className="text-xs" style={{ color: strengthColors[strength] }}>{strengthLabels[strength]}</p>
                      </div>
                    )}
                    {errors.password && <p className="text-[#ef4444] text-xs mt-1">{errors.password.message}</p>}
                  </div>
                  <div>
                    <label className="text-[11px] text-[var(--muted)] font-bold uppercase tracking-wider mb-1.5 block">Confirmar senha</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--hint)]" />
                      <input type={showCPw ? 'text' : 'password'} placeholder="Repita a senha" {...register('confirmPassword')} className="input-field pr-12" />
                      <button type="button" onClick={() => setShowCPw(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--hint)] hover:text-[var(--purple-l)] transition-colors">
                        {showCPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-[#ef4444] text-xs mt-1">{errors.confirmPassword.message}</p>}
                  </div>
                  <button type="button" onClick={nextStep} className="btn-primary mt-1">CONTINUAR →</button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-4">
                  <div className="text-center py-2">
                    <div className="text-5xl mb-3 animate-float">🎓</div>
                    <div className="font-display text-2xl font-bold mb-2 grad-text">Quase lá!</div>
                    <p className="text-[var(--muted)] text-sm">Confirme seus dados e inicie sua jornada.</p>
                  </div>
                  <div className="rounded-xl p-4 flex flex-col gap-2.5" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)' }}>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--muted)]">Nome</span><span className="font-medium">{watch('name')}</span>
                    </div>
                    <div className="h-px" style={{ background: 'var(--border)' }}/>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--muted)]">E-mail</span><span className="font-medium">{watch('email')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl text-sm text-[var(--muted)]"
                    style={{ background: 'rgba(124,58,237,.07)', border: '1px solid rgba(124,58,237,.2)' }}>
                    <Shield size={18} className="text-[var(--purple-l)] flex-shrink-0" />
                    Sua conta é protegida com segurança de nível máximo.
                  </div>
                  <button type="submit" disabled={isLoading} className="btn-primary">
                    {isLoading ? 'Criando conta...' : 'CRIAR CONTA 🚀'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <p className="text-center text-[var(--muted)] text-sm mt-5">
            Já tem conta?{' '}
            <Link to="/login" className="text-[var(--purple-l)] hover:text-[var(--pink)] font-semibold transition-colors">Entrar</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
