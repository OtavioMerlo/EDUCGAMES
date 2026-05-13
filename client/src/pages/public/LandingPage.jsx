import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const features = [
  { icon: '🎯', title: 'Missões Diárias', desc: 'Complete desafios todos os dias e acumule XP e moedas virtuais progressivamente.' },
  { icon: '🏆', title: 'Ranking Competitivo', desc: 'Dispute com alunos de todo o Brasil em rankings globais e semanais.' },
  { icon: '🎁', title: 'Marketplace', desc: 'Troque suas moedas por Spotify, Netflix, jogos, gift cards e muito mais.' },
  { icon: '⚡', title: 'Sistema de XP', desc: 'Suba de nível e desbloqueie novos títulos, avatares e conquistas exclusivas.' },
  { icon: '🔥', title: 'Streak Diário', desc: 'Mantenha sua sequência de estudos diários e ganhe bônus crescentes de XP.' },
  { icon: '🧠', title: 'Quizzes Interativos', desc: 'Responda quizzes, tarefas e desafios criados por professores qualificados.' },
]

const stats = [
  { value: '120k+', label: 'Alunos ativos' },
  { value: '98%', label: 'Satisfação' },
  { value: '4.9★', label: 'App Store' },
  { value: '50+', label: 'Matérias' },
]

export default function LandingPage() {
  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="blobs"><div className="blob b1"/><div className="blob b2"/><div className="blob b3"/></div>
      <div className="bg-grid"/>

      {/* ── NAVBAR ── */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-16 py-5">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <div className="logo-ring" style={{ borderRadius: 12, inset: -3 }}/>
            <div className="relative w-full h-full rounded-xl flex items-center justify-center" style={{ background: 'var(--bg2)' }}>
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <defs><linearGradient id="nav-g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#a855f7"/><stop offset="100%" stopColor="#22d3ee"/>
                </linearGradient></defs>
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="url(#nav-g)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="url(#nav-g)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <span className="font-display text-xl font-bold tracking-widest">
            <span className="text-[var(--text)]">EDUCA</span>
            <span className="grad-text">GAMES</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <button className="px-5 py-2 rounded-xl text-sm font-semibold transition-all text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/5">
              Entrar
            </button>
          </Link>
          <Link to="/register">
            <button className="btn-primary" style={{ width: 'auto', padding: '10px 22px', fontSize: 14, letterSpacing: '1px' }}>
              Criar conta grátis
            </button>
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-16 pb-24 lg:pt-24">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8 tracking-wider uppercase"
            style={{ background: 'rgba(124,58,237,.15)', border: '1px solid rgba(168,85,247,.3)', color: 'var(--purple-l)' }}>
            🚀 A plataforma educacional mais gamificada do Brasil
          </div>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl lg:text-7xl font-bold leading-none mb-6 max-w-4xl">
          Aprenda. Conquiste.
          <br/>
          <span className="grad-text">Evolua.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[var(--muted)] text-lg lg:text-xl max-w-2xl mb-10 leading-relaxed">
          Transforme o estudo em uma aventura épica. Ganhe XP, suba de nível, compita no ranking e troque moedas por prêmios reais como Spotify, Netflix e jogos.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link to="/register">
            <button className="btn-primary" style={{ width: 'auto', padding: '16px 36px', fontSize: 16, letterSpacing: '2px' }}>
              COMEÇAR AGORA 🚀
            </button>
          </Link>
          <Link to="/login">
            <button className="px-9 py-4 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'var(--inp)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 14 }}>
              Já tenho conta →
            </button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-8 lg:gap-16">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-3xl font-bold grad-text">{value}</div>
              <div className="text-[var(--muted)] text-sm mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── GAMIFICATION PREVIEW ── */}
      <section className="relative z-10 px-6 lg:px-16 pb-20">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-4xl mx-auto rounded-3xl p-8 lg:p-12 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,rgba(124,58,237,.15),rgba(236,72,153,.08))', border: '1px solid rgba(168,85,247,.25)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(ellipse,rgba(168,85,247,.15),transparent 70%)', transform: 'translate(30%,-40%)' }}/>

          <div className="relative z-10 grid lg:grid-cols-3 gap-6">
            {/* XP Card mini */}
            <div className="lg:col-span-2">
              <div className="text-[11px] text-[var(--muted)] uppercase tracking-widest mb-2 font-bold">Seu progresso</div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--grad)', boxShadow: 'var(--glow-btn)' }}>
                  <span className="text-[9px] opacity-80">nível</span>
                  <span className="font-display text-2xl font-bold">12</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-display text-xl font-bold">2.450 XP</span>
                    <span className="text-[var(--muted)]">/ 3.500</span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.08)' }}>
                    <motion.div className="xp-bar-fill" style={{ height: '100%', borderRadius: 6 }}
                      initial={{ width: 0 }} whileInView={{ width: '70%' }}
                      viewport={{ once: true }} transition={{ duration: 1.5, ease: 'easeOut' }} />
                  </div>
                  <div className="text-[11px] text-[var(--purple-l)] mt-1">✨ Faltam apenas 1.050 XP para o nível 13!</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[['🔥', '14', 'dias streak'], ['🪙', '1.250', 'moedas'], ['🏆', '#7', 'ranking']].map(([ic, v, l]) => (
                  <div key={l} className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,.05)', border: '1px solid var(--border)' }}>
                    <div className="text-xl mb-1">{ic}</div>
                    <div className="font-display text-lg font-bold">{v}</div>
                    <div className="text-[var(--muted)] text-[10px]">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reward preview */}
            <div>
              <div className="text-[11px] text-[var(--muted)] uppercase tracking-widest mb-2 font-bold">Próxima recompensa</div>
              <div className="p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg,#1DB954,#158a3e)', border: '1px solid rgba(29,185,84,.3)' }}>
                <div className="text-4xl mb-3">🎵</div>
                <div className="font-bold mb-1">Spotify Premium</div>
                <div className="text-[11px] opacity-80 mb-3">1 mês de música ilimitada</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.2)' }}>
                    <div className="h-full rounded-full" style={{ width: '71%', background: 'white' }}/>
                  </div>
                  <span className="text-xs font-bold">250/350 🪙</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-10 px-6 lg:px-16 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="font-display text-4xl lg:text-5xl font-bold mb-4">
            Tudo que você precisa para
            <span className="grad-text"> estudar melhor</span>
          </h2>
          <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
            Uma plataforma completa inspirada em Duolingo, Steam e Discord para manter você motivado.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="p-6 rounded-2xl transition-all cursor-default"
              style={{ background: 'var(--inp)', border: '1px solid var(--border)' }}>
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-display text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 px-6 lg:px-16 pb-24">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center p-12 rounded-3xl relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,rgba(124,58,237,.2),rgba(236,72,153,.15))', border: '1px solid rgba(168,85,247,.3)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%,rgba(168,85,247,.2),transparent 60%)' }}/>
          <div className="relative z-10">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="font-display text-4xl font-bold mb-4">Pronto para começar?</h2>
            <p className="text-[var(--muted)] text-lg mb-8">
              Crie sua conta gratuitamente e ganhe 100 moedas de bônus!
            </p>
            <Link to="/register">
              <button className="btn-primary" style={{ width: 'auto', padding: '16px 40px', fontSize: 16, letterSpacing: '2px' }}>
                CRIAR CONTA GRÁTIS 🎮
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-8 text-[var(--muted)] text-sm">
        <p>© 2024 EducaGames. Desenvolvido como TCC.</p>
      </footer>
    </div>
  )
}
