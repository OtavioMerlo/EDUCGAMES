import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import toast from 'react-hot-toast'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false)
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    try {
      const res = await login(data.email, data.password)
      toast.success(`Bem-vindo de volta, ${res.user.name.split(' ')[0]}! 🎮`)
      if (res.user.role === 'ADMIN') navigate('/admin')
      else if (res.user.role === 'TEACHER') navigate('/teacher')
      else navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao fazer login')
    }
  }

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="blobs"><div className="blob b1"/><div className="blob b2"/><div className="blob b3"/></div>
      <div className="bg-grid"/>

      <div className="relative z-10 min-h-screen grid lg:grid-cols-2">
        {/* ── LEFT PANEL ── */}
        <div className="hidden lg:flex flex-col justify-center items-start px-16 py-20 relative">
          <div className="absolute top-0 right-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(180deg,transparent,rgba(168,85,247,.4) 30%,rgba(236,72,153,.4) 70%,transparent)' }}/>

          {/* Logo */}
          <div className="mb-12">
            <div className="relative w-24 h-24 mb-5 animate-float">
              <div className="logo-ring"/>
              <div className="relative w-full h-full rounded-[18px] flex items-center justify-center" style={{ background: 'var(--bg2)', boxShadow: 'inset 0 0 28px rgba(168,85,247,.1)' }}>
                <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12">
                  <defs><linearGradient id="lg-login" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a855f7"/><stop offset="100%" stopColor="#22d3ee"/>
                  </linearGradient></defs>
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="url(#lg-login)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="url(#lg-login)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="font-display text-5xl font-bold tracking-[5px] leading-none mb-3">
              <span className="text-[var(--text)]">EDUCA</span>
              <span className="grad-text">GAMES</span>
            </div>
            <p className="text-[var(--muted)] text-base leading-relaxed font-light">
              Aprenda. Conquiste.<br/>Evolua todos os dias.
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-col gap-3 w-full max-w-sm">
            {[
              { icon: '🎯', title: 'Missões diárias', desc: 'Complete desafios e ganhe XP todo dia' },
              { icon: '🏆', title: 'Ranking competitivo', desc: 'Dispute com alunos de todo o Brasil' },
              { icon: '🎁', title: 'Recompensas reais', desc: 'Troque moedas por jogos, Spotify e mais' },
            ].map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-white/5 transition-colors"
                style={{ background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: i === 0 ? 'rgba(124,58,237,.2)' : i === 1 ? 'rgba(236,72,153,.2)' : 'rgba(34,211,238,.2)' }}>
                  {f.icon}
                </div>
                <div>
                  <div className="font-semibold text-sm">{f.title}</div>
                  <div className="text-[var(--muted)] text-xs">{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-12 pt-10 border-t border-[var(--border)] w-full">
            {[['120k+', 'Alunos ativos'], ['98%', 'Satisfação'], ['4.9★', 'App Store']].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-2xl font-bold grad-text">{n}</div>
                <div className="text-[var(--muted)] text-xs tracking-wider">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL (Form) ── */}
        <div className="flex flex-col justify-center items-center px-6 lg:px-12 py-12">
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="relative w-16 h-16 mb-3 animate-float">
              <div className="logo-ring"/>
              <div className="relative w-full h-full rounded-2xl flex items-center justify-center" style={{ background: 'var(--bg2)' }}>
                <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
                  <defs><linearGradient id="m-lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#a855f7"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs>
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="url(#m-lg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="url(#m-lg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="font-display text-2xl font-bold tracking-widest">
              <span className="text-[var(--text)]">EDUCA</span><span className="grad-text">GAMES</span>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
            className="w-full max-w-sm">
            <h1 className="font-display text-4xl font-bold tracking-wide mb-1"
              style={{ background: 'linear-gradient(135deg,#e2e8f0 30%,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Bem-vindo!
            </h1>
            <p className="text-[var(--muted)] text-sm mb-7">Entre na sua conta e continue sua jornada.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
              {/* Email */}
              <div>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--hint)]" />
                  <input type="email" placeholder="seu@email.com" {...register('email')}
                    className="input-field" />
                </div>
                {errors.email && <p className="text-[#ef4444] text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <Link to="/forgot-password" title="Funcionalidade em desenvolvimento" className="block text-right text-xs text-[var(--purple-l)] hover:text-[var(--pink)] mb-1.5 font-semibold transition-colors">
                  Esqueceu sua senha?
                </Link>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--hint)]" />
                  <input type={showPw ? 'text' : 'password'} placeholder="Senha" {...register('password')}
                    className="input-field pr-12" />
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--hint)] hover:text-[var(--purple-l)] transition-colors">
                    {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
                {errors.password && <p className="text-[#ef4444] text-xs mt-1">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary mt-1">
                {isLoading ? '...' : 'ENTRAR'}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-5 p-3.5 rounded-xl text-xs" style={{ background: 'rgba(124,58,237,.07)', border: '1px solid rgba(124,58,237,.2)' }}>
              <div className="text-[var(--purple-l)] font-bold mb-2 flex items-center gap-1.5">🔑 Contas de demonstração</div>
              <div className="grid grid-cols-1 gap-1 text-[var(--muted)]">
                <span>Aluno: <b className="text-[var(--text)]">aluno@educagames.com</b> / student123</span>
                <span>Prof: <b className="text-[var(--text)]">professor@educagames.com</b> / teacher123</span>
                <span>Admin: <b className="text-[var(--text)]">admin@educagames.com</b> / admin123</span>
              </div>
            </div>

            <p className="text-center text-[var(--muted)] text-sm mt-5">
              Ainda não tem conta?{' '}
              <Link to="/register" className="text-[var(--purple-l)] hover:text-[var(--pink)] font-semibold transition-colors">
                Criar conta
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
