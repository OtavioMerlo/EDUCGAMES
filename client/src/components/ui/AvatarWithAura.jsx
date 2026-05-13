import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── AURA DEFINITIONS ──────────────────────────────────────────────────────────
export const AURAS = {
  // ── Dragon Ball (legacy) ──
  'Aura Super Saiyajin': {
    particles: { colors: ['244,187,36', '255,235,128', '255,200,50'], count: 40, speed: 0.8 },
    glow: '#fbbf24', glow2: '#fff7ed', type: 'aggressive',
    rarity: 'RARE', label: 'SSJ', icon: '⚡'
  },
  'Aura Kaioken': {
    particles: { colors: ['239,68,68', '180,20,20', '255,120,80'], count: 45, speed: 1.1 },
    glow: '#ef4444', glow2: '#450a0a', type: 'aggressive',
    rarity: 'RARE', label: 'Kaioken', icon: '🏮'
  },
  'Aura SSJ Blue': {
    particles: { colors: ['59,130,246', '147,210,255', '30,64,175'], count: 50, speed: 0.9 },
    glow: '#3b82f6', glow2: '#eff6ff', type: 'aggressive',
    rarity: 'EPIC', label: 'SSJ Blue', icon: '🌊'
  },
  'Aura Instinto Superior': {
    particles: { colors: ['226,232,240', '255,255,255', '180,190,210'], count: 35, speed: 0.5 },
    glow: '#e2e8f0', glow2: '#ffffff', type: 'ghost',
    rarity: 'EPIC', label: 'MUI', icon: '⚪'
  },
  'Aura SSJ God': {
    particles: { colors: ['244,63,94', '251,113,133', '200,20,60'], count: 48, speed: 0.9 },
    glow: '#f43f5e', glow2: '#fb7185', type: 'aggressive',
    rarity: 'RARE', label: 'SSJ God', icon: '🔥'
  },
  'Aura SSJ Rosé': {
    particles: { colors: ['217,70,239', '245,208,254', '150,20,180'], count: 45, speed: 0.85 },
    glow: '#d946ef', glow2: '#f5d0fe', type: 'aggressive',
    rarity: 'EPIC', label: 'SSJ Rosé', icon: '🥀'
  },
  'Aura Lendário': {
    particles: { colors: ['251,191,36', '124,58,237', '255,255,255'], count: 70, speed: 1.2 },
    glow: '#fbbf24', glow2: '#7c3aed', type: 'legendary',
    rarity: 'LEGENDARY', label: 'Lendário', icon: '👑'
  },
  'Aura Broly Lendário': {
    particles: { colors: ['34,197,94', '240,253,244', '20,120,50'], count: 55, speed: 1.1 },
    glow: '#22c55e', glow2: '#f0fdf4', type: 'aggressive',
    rarity: 'EPIC', label: 'Broly', icon: '🍏'
  },

  // ── Naruto Chakra Modes ──
  'Modo Chakra Básico': {
    particles: { colors: ['59,139,235', '255,123,0', '100,160,255'], count: 35, speed: 0.6 },
    glow: '#3b8beb', glow2: '#ff7b00', type: 'naruto-basic',
    rarity: 'COMMON', label: 'Chakra', icon: '🌀'
  },
  'Modo Kurama': {
    particles: { colors: ['244,167,66', '255,204,0', '255,123,0'], count: 55, speed: 0.95 },
    glow: '#f4a742', glow2: '#ffcc00', type: 'naruto-kurama',
    rarity: 'RARE', label: 'Kurama', icon: '🦊'
  },
  'Modo Kurama Completo': {
    particles: { colors: ['255,170,0', '255,204,0', '255,140,0'], count: 65, speed: 1.15 },
    glow: '#ffaa00', glow2: '#ff8c00', type: 'naruto-bijuu',
    rarity: 'EPIC', label: 'Bijuu', icon: '💥'
  },
  'Modo Sábio': {
    particles: { colors: ['139,195,74', '205,220,57', '90,158,75'], count: 40, speed: 0.5 },
    glow: '#8bc34a', glow2: '#cddc39', type: 'naruto-sage',
    rarity: 'RARE', label: 'Sage', icon: '🍃'
  },
  'Modo Sábio dos Seis Caminhos': {
    particles: { colors: ['255,255,255', '255,238,192', '255,215,0'], count: 50, speed: 0.75 },
    glow: '#ffffff', glow2: '#ffeec0', type: 'naruto-sixpaths',
    rarity: 'EPIC', label: '6 Paths', icon: '✨'
  },
  'Modo Rinnegan': {
    particles: { colors: ['123,47,190', '155,79,222', '50,0,80'], count: 40, speed: 0.65 },
    glow: '#7b2fbe', glow2: '#c9a0dc', type: 'naruto-rinnegan',
    rarity: 'EPIC', label: 'Rinnegan', icon: '👁️'
  },
  'Modo Kurama + Sábio': {
    particles: { colors: ['255,204,0', '139,195,74', '255,153,0'], count: 60, speed: 0.9 },
    glow: '#ffcc00', glow2: '#8bc34a', type: 'naruto-hybrid',
    rarity: 'LEGENDARY', label: 'Hybrid', icon: '⚡'
  },
  'Modo Baryon': {
    particles: { colors: ['224,48,48', '139,0,0', '255,64,64'], count: 70, speed: 1.35 },
    glow: '#e03030', glow2: '#8b0000', type: 'naruto-baryon',
    rarity: 'LEGENDARY', label: 'Baryon', icon: '💀'
  },
  'Modo Akatsuki': {
    particles: { colors: ['20,0,0', '139,26,26', '50,10,10'], count: 25, speed: 0.35 },
    glow: '#1a0000', glow2: '#8b1a1a', type: 'naruto-akatsuki',
    rarity: 'EPIC', label: 'Akatsuki', icon: '☁️'
  },
  // ── Effects ──
  'Efeito Fogos Artificiais': {
    particles: { colors: ['236,72,153', '250,204,21', '59,130,246'], count: 50, speed: 1.0 },
    glow: '#ec4899', glow2: '#facc15', type: 'fireworks',
    rarity: 'COMMON', label: 'Fogos', icon: '🎆'
  },
  'Efeito Confetes': {
    particles: { colors: ['250,204,21', '34,197,94', '239,68,68'], count: 45, speed: 0.7 },
    glow: '#facc15', glow2: '#22c55e', type: 'confetti',
    rarity: 'COMMON', label: 'Confetes', icon: '🎊'
  },
  'Efeito Fogos Azuis': {
    particles: { colors: ['6,182,212', '147,210,255', '30,58,138'], count: 50, speed: 0.9 },
    glow: '#06b6d4', glow2: '#0891b2', type: 'particles',
    rarity: 'COMMON', label: 'Fogos Azuis', icon: '🎇'
  },
}

export const ACCESSORIES = {
  'Chapéu de Samurai': { type: 'hat', src: '🎌', offset: '-top-4', rarity: 'COMMON' },
  'Headband Konoha': { type: 'image', src: '/acessorios/bandana.png', pos: { top: '15%', height: '15%', width: '110%', left: '-5%' }, rarity: 'LEGENDARY' },
  'Headband Akatsuki': { type: 'headband', color: '#cc2222', rarity: 'RARE' },
  'Coroa Lendária': { type: 'crown', color: '#fbbf24', rarity: 'LEGENDARY' },
  'Óculos Estilosos': { type: 'glasses', rarity: 'RARE' },
  'Chapéu do Hokage': { type: 'image', src: '/acessorios/chapeu do hokage.png', pos: { top: '-35%', height: '50%', width: '110%', left: '-5%' }, rarity: 'EPIC' },
  // Legendary Anime Items
  'Cabelo Super Saiyajin': { type: 'image', src: '/acessorios/saiajin.png', pos: { top: '-60%', height: '120%', width: '160%', left: '-30%' }, rarity: 'LEGENDARY' },
  'Cabelo Deus Sayajin': { type: 'image', src: '/acessorios/deus super sayajin.png', pos: { top: '-55%', height: '115%', width: '155%', left: '-27.5%' }, rarity: 'LEGENDARY' },
  'Cabelo Sayajin Clássico': { type: 'image', src: '/acessorios/cabelo goku.png', pos: { top: '-55%', height: '110%', width: '150%', left: '-25%' }, rarity: 'LEGENDARY' },
  'Marca do Caçador — Tanjiro': { type: 'image', src: '/acessorios/marca do caçador.png', pos: { top: '5%', right: '0%', height: '40%', width: '40%' }, rarity: 'LEGENDARY' },
  'Sharingan do Uchiha': { type: 'image', src: '/acessorios/sharingan.png', pos: { bottom: '-5%', right: '-15%', height: '50%', width: '60%' }, rarity: 'LEGENDARY' },
  'Rinnegan Puro': { type: 'image', src: '/acessorios/rinengan.png', pos: { bottom: '-5%', right: '-15%', height: '50%', width: '60%' }, rarity: 'LEGENDARY' },
  'Rinnegan-Sharingan Eterno': { type: 'image', src: '/acessorios/rinesharingan.png', pos: { bottom: '-5%', right: '-15%', height: '50%', width: '60%' }, rarity: 'LEGENDARY' },
  'Nuvem da Akatsuki': { type: 'image', src: '/acessorios/akttsuki.png', pos: { bottom: '-10%', right: '-20%', height: '55%', width: '65%' }, rarity: 'LEGENDARY' },
  'Brincos Potara': { type: 'image', src: '/acessorios/brincos do dragao ball.png', pos: { bottom: '-15%', right: '-25%', height: '70%', width: '80%' }, rarity: 'LEGENDARY' },
  'Manto Kurama Completo': { type: 'image', src: '/acessorios/naruto chakara.png', pos: { inset: '-35%', opacity: 0.8 }, rarity: 'LEGENDARY' },
  // Dragon Ball Transformations (Full Overlay)
  'Goku Ultra Instinto': { type: 'image', src: '/acessorios/goku extinto superior completo.png', pos: { inset: '-40%' }, rarity: 'LEGENDARY' },
  'Goku UI Incompleto': { type: 'image', src: '/acessorios/goku extintosuperior incompleto.png', pos: { inset: '-35%' }, rarity: 'LEGENDARY' },
  'Goku Blue': { type: 'image', src: '/acessorios/gokublue.png', pos: { inset: '-35%' }, rarity: 'LEGENDARY' },
  'Goku Blue Kaioken': { type: 'image', src: '/acessorios/gokubluekaioken.png', pos: { inset: '-35%' }, rarity: 'LEGENDARY' },
  'Goku God': { type: 'image', src: '/acessorios/gokugod.png', pos: { inset: '-35%' }, rarity: 'LEGENDARY' },
  'Goku SSJ2': { type: 'image', src: '/acessorios/gokussj2.png', pos: { inset: '-35%' }, rarity: 'LEGENDARY' },
  'Goku SSJ3': { type: 'image', src: '/acessorios/gokussj3.png', pos: { inset: '-45%' }, rarity: 'LEGENDARY' },
  'Goku SSJ4': { type: 'image', src: '/acessorios/gokussj4.png', pos: { inset: '-40%' }, rarity: 'LEGENDARY' },
  'Gohan Beast': { type: 'image', src: '/acessorios/gohanbeast.png', pos: { inset: '-35%' }, rarity: 'LEGENDARY' },
  'Gohan SSJ1': { type: 'image', src: '/acessorios/gonhassj1.png', pos: { inset: '-35%' }, rarity: 'LEGENDARY' },
  'Goku Base': { type: 'image', src: '/acessorios/goku.png', pos: { inset: '-35%' }, rarity: 'LEGENDARY' },
  'Goku God Full': { type: 'image', src: '/acessorios/gokugod.png', pos: { inset: '-35%' }, rarity: 'LEGENDARY' },
  'Goku SSJ1 Full': { type: 'image', src: '/acessorios/ssj1 goku.png', pos: { inset: '-35%' }, rarity: 'LEGENDARY' },
  'Sasuke Uchiha': { type: 'image', src: '/acessorios/sasuke.png', pos: { inset: '-35%' }, rarity: 'LEGENDARY' },
  'Vegeta SSJ1': { type: 'image', src: '/acessorios/vegetassj1.png', pos: { inset: '-35%' }, rarity: 'LEGENDARY' },
  'Vegeta Blue': { type: 'image', src: '/acessorios/vegetassj-blue.png', pos: { inset: '-35%' }, rarity: 'LEGENDARY' },
  'Vegeta God': { type: 'image', src: '/acessorios/ssj-god.png', pos: { inset: '-35%' }, rarity: 'LEGENDARY' },
  'Majin Vegeta': { type: 'image', src: '/acessorios/majin-vegeta.png', pos: { inset: '-35%' }, rarity: 'LEGENDARY' },
  'Vegeta Ultra Ego': { type: 'image', src: '/acessorios/ultra-egoo.png', pos: { inset: '-35%' }, rarity: 'LEGENDARY' },
}

// ── CANVAS PARTICLE SYSTEM ──────────────────────────────────────────────────────
function useParticleCanvas(canvasRef, auraData, size) {
  useEffect(() => {
    if (!auraData || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { colors, count, speed } = auraData.particles
    const dim = canvas.offsetWidth || 80
    canvas.width = dim * 2
    canvas.height = dim * 2
    ctx.scale(2, 2)
    const w = dim, h = dim

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.5 + 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * speed * 1.5,
      vy: -(Math.random() * speed * 1.5 + speed * 0.3),
      life: Math.random(),
      fade: Math.random() * 0.012 + 0.005,
    }))

    let raf
    const animate = () => {
      ctx.clearRect(0, 0, w, h)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.life += p.fade
        if (p.y < -10 || p.life > 1.4) {
          p.x = Math.random() * w; p.y = h + 5; p.life = 0
          p.vy = -(Math.random() * speed * 1.5 + speed * 0.3)
          p.vx = (Math.random() - 0.5) * speed * 2
        }
        const alpha = Math.sin(p.life * Math.PI) * 0.75 + 0.1
        // glow halo
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4)
        g.addColorStop(0, `rgba(${p.color},${alpha * 0.6})`)
        g.addColorStop(1, `rgba(${p.color},0)`)
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fill()
        // core
        ctx.fillStyle = `rgba(${p.color},${alpha})`
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill()
      })
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(raf)
  }, [auraData, size])
}

// ── GLOW RING COMPONENT ────────────────────────────────────────────────────────
function GlowRing({ color, delay = 0, duration = 2 }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-full border-2 pointer-events-none"
      style={{ borderColor: color, boxShadow: `0 0 20px ${color}` }}
      animate={{ scale: [1, 1.8], opacity: [0.7, 0] }}
      transition={{ duration, repeat: Infinity, delay, ease: 'easeOut' }}
    />
  )
}

// ── DISTORTION RINGS (Rinnegan) ────────────────────────────────────────────────
function DistortionRings({ color }) {
  return (
    <>
      {[140, 170].map((size, i) => (
        <motion.div key={i}
          className="absolute rounded-full border pointer-events-none"
          style={{ width: size / 2, height: size / 2, borderColor: `${color}40`, left: '50%', top: '50%', marginLeft: -size / 4, marginTop: -size / 4 }}
          animate={{ rotate: i % 2 ? 360 : -360 }}
          transition={{ duration: i % 2 ? 8 : 6, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </>
  )
}

// ── TAIL WAGS (Kurama tails) ────────────────────────────────────────────────────
function Tails({ count = 9, color = '#f4a742' }) {
  return (
    <div className="absolute bottom-0 flex gap-0.5 pointer-events-none" style={{ zIndex: 0 }}>
      {Array.from({ length: count }, (_, i) => (
        <motion.div key={i}
          className="rounded-t-full"
          style={{ width: 3, height: 16, background: `linear-gradient(to top, ${color}, ${color}40)`, boxShadow: `0 0 8px ${color}80` }}
          animate={{ rotate: [-8, 6, -5, 7] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.08, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ── FLOATING ORBS (Six Paths) ───────────────────────────────────────────────────
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[
        { top: '15%', left: '10%', d: 0 }, { top: '8%', right: '15%', d: 0.5 },
        { top: '20%', right: '8%', d: 1 }, { bottom: '20%', left: '8%', d: 1.5 },
        { top: '5%', left: '35%', d: 0.7 }, { bottom: '25%', right: '10%', d: 1.2 },
      ].map((pos, i) => (
        <motion.div key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{ ...pos, background: 'radial-gradient(circle, #222 0%, #000 100%)', boxShadow: '0 0 12px rgba(255,255,255,0.3)' }}
          animate={{ y: [0, -8, -3, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ── ACCESSORY OVERLAY ─────────────────────────────────────────────────────────
function AccessoryOverlay({ accessoryKey }) {
  const acc = accessoryKey ? ACCESSORIES[accessoryKey] : null
  if (!acc) return null

  if (acc.type === 'headband') {
    return (
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ zIndex: 30 }}>
        <div className="absolute" style={{ top: '18%', left: '-4%', right: '-4%', height: 6, background: acc.color, borderRadius: 3, boxShadow: `0 0 10px ${acc.color}` }}>
          <div className="absolute right-0 top-0 w-1.5 h-8 rounded-b" style={{ background: acc.color, boxShadow: `0 0 8px ${acc.color}` }} />
        </div>
      </div>
    )
  }
  if (acc.type === 'crown') {
    return (
      <motion.div className="absolute pointer-events-none flex items-center justify-center" style={{ top: '-22%', left: 0, right: 0, zIndex: 30 }}
        animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <svg viewBox="0 0 40 24" className="w-10 h-6">
          <path d="M2 20 L5 8 L12 16 L20 2 L28 16 L35 8 L38 20 Z" fill={acc.color} stroke={acc.color} strokeWidth="1" />
          {[8, 20, 32].map(x => <circle key={x} cx={x} cy="20" r="2.5" fill="#fff" />)}
        </svg>
      </motion.div>
    )
  }
  if (acc.type === 'glasses') {
    return (
      <div className="absolute pointer-events-none" style={{ top: '38%', left: '-8%', right: '-8%', zIndex: 30 }}>
        <svg viewBox="0 0 60 18" className="w-full h-4">
          <circle cx="15" cy="9" r="7" fill="none" stroke="#1a1a1a" strokeWidth="2.5" />
          <circle cx="45" cy="9" r="7" fill="none" stroke="#1a1a1a" strokeWidth="2.5" />
          <line x1="22" y1="9" x2="38" y2="9" stroke="#1a1a1a" strokeWidth="2" />
          <line x1="0" y1="9" x2="8" y2="9" stroke="#1a1a1a" strokeWidth="2" />
          <line x1="52" y1="9" x2="60" y2="9" stroke="#1a1a1a" strokeWidth="2" />
        </svg>
      </div>
    )
  }
  if (acc.type === 'hokage-hat') {
    return (
      <div className="absolute pointer-events-none" style={{ top: '-30%', left: '-10%', right: '-10%', zIndex: 30 }}>
        <svg viewBox="0 0 70 40" className="w-full">
          <ellipse cx="35" cy="36" rx="32" ry="6" fill="#fff" />
          <path d="M10 36 Q15 10 35 5 Q55 10 60 36 Z" fill="#fff" />
          <rect x="8" y="30" width="54" height="6" fill="#fff" rx="2" />
          <text x="35" y="26" textAnchor="middle" fontSize="10" fill="#c0392b" fontWeight="bold">火</text>
        </svg>
      </div>
    )
  }
  if (acc.type === 'image') {
    return (
      <div className="absolute pointer-events-none" style={{ ...acc.pos, zIndex: 30 }}>
        <img src={acc.src} alt="" className="w-full h-full object-contain" />
      </div>
    )
  }
  // Default emoji hat
  return (
    <div className="absolute pointer-events-none text-lg" style={{ top: '-20%', left: '50%', transform: 'translateX(-50%)', zIndex: 30 }}>
      {acc.src}
    </div>
  )
}

// ── MAIN COMPONENT ──────────────────────────────────────────────────────────────
export default function AvatarWithAura({ user, size = 'md', className = '', showAccessory = true }) {
  const canvasRef = useRef(null)
  const aura = user?.equippedAura ? AURAS[user.equippedAura] : null
  const initials = user?.name?.charAt(0).toUpperCase() || '?'

  useParticleCanvas(canvasRef, aura, size)

  const sizes = {
    xs: { wrap: 'w-8 h-8',   text: 'text-[10px]' },
    sm: { wrap: 'w-10 h-10', text: 'text-sm' },
    md: { wrap: 'w-14 h-14', text: 'text-xl' },
    lg: { wrap: 'w-20 h-20', text: 'text-3xl' },
    xl: { wrap: 'w-24 h-24', text: 'text-4xl' },
  }

  const sz = sizes[size] || sizes.md
  const isLarge = size === 'lg' || size === 'xl'
  const showParticles = size !== 'xs'

  // Per-type special overlay elements
  const renderSpecialFX = () => {
    if (!aura) return null
    switch (aura.type) {
      case 'naruto-kurama': return <Tails count={9} color="#f4a742" />
      case 'naruto-hybrid': return <Tails count={6} color="#e6c430" />
      case 'naruto-bijuu': return (
        <>
          <Tails count={9} color="#ffaa00" />
          {[0, 0.6, 1.2].map((d, i) => (
            <motion.div key={i} className="absolute rounded-full border border-yellow-400/30 pointer-events-none"
              style={{ width: (i + 1) * 20 + '%', height: (i + 1) * 20 + '%', left: '50%', top: '80%', marginLeft: `-${(i + 1) * 10}%`, marginTop: `-${(i + 1) * 5}%` }}
              animate={{ scale: [0.6, 1.5], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: d }}
            />
          ))}
        </>
      )
      case 'naruto-sixpaths': return <FloatingOrbs />
      case 'naruto-rinnegan': return <DistortionRings color="#7b2fbe" />
      case 'legendary': return (
        <>
          <GlowRing color="#fbbf24" delay={0} duration={1.5} />
          <GlowRing color="#7c3aed" delay={0.75} duration={1.5} />
        </>
      )
      case 'naruto-baryon': return (
        <>
          <GlowRing color="#e03030" delay={0} duration={0.8} />
          <GlowRing color="#8b0000" delay={0.4} duration={0.8} />
        </>
      )
      default: return null
    }
  }

  const glowColor = aura?.glow || null
  const glowColor2 = aura?.glow2 || null
  const isBijuu = aura?.type === 'naruto-bijuu' || aura?.type === 'legendary'
  const isBaryon = aura?.type === 'naruto-baryon'

  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 ${className}`}>
      <AnimatePresence>
        {aura && (
          <motion.div
            key={user?.equippedAura}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute pointer-events-none"
            style={{ inset: '-55%', zIndex: 0 }}
          >
            {/* Ambient glow blob */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: glowColor2
                  ? `radial-gradient(circle, ${glowColor}60 0%, ${glowColor2}30 50%, transparent 70%)`
                  : `radial-gradient(circle, ${glowColor}60 0%, transparent 70%)`,
                filter: 'blur(8px)'
              }}
              animate={
                isBaryon
                  ? { opacity: [0.5, 0.9, 0.4, 0.85] }
                  : isBijuu
                  ? { opacity: [0.5, 0.9, 0.5], scale: [1, 1.05, 1] }
                  : { opacity: [0.4, 0.75, 0.4] }
              }
              transition={{ duration: isBaryon ? 0.6 : 2, repeat: Infinity }}
            />

            {/* Canvas particles */}
            {showParticles && (
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full rounded-full"
                style={{ opacity: 0.9 }}
              />
            )}

            {/* Special FX elements */}
            {renderSpecialFX()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accessory (hat / headband / etc) */}
      {showAccessory && user?.equippedAccessory && (
        <AccessoryOverlay accessoryKey={user.equippedAccessory} />
      )}

      {/* Avatar circle */}
      <motion.div
        className={`${sz.wrap} ${sz.text} rounded-full flex items-center justify-center font-bold relative shadow-xl border-2 border-white/20`}
        style={{
          background: user?.avatarColor || 'var(--grad)',
          zIndex: 10,
          boxShadow: glowColor ? `0 0 16px ${glowColor}60, 0 4px 16px rgba(0,0,0,0.4)` : '0 4px 16px rgba(0,0,0,0.4)'
        }}
        animate={isBaryon ? { boxShadow: [`0 0 16px ${glowColor}80`, `0 0 32px ${glowColor}cc`, `0 0 16px ${glowColor}80`] } : {}}
        transition={isBaryon ? { duration: 0.7, repeat: Infinity } : {}}
      >
        {initials}
      </motion.div>

      {/* Level badge */}
      {isLarge && (
        <div className="absolute -bottom-1 -right-1 z-20 px-2 py-0.5 rounded-full text-[10px] font-black shadow-lg"
          style={{ background: 'var(--grad)', color: '#fff' }}>
          Nv.{user?.level}
        </div>
      )}

      {/* Aura name tag (xl only) */}
      {size === 'xl' && aura && (
        <motion.div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: `${glowColor}25`, color: glowColor, border: `1px solid ${glowColor}50`, zIndex: 20 }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {aura.icon} {aura.label}
        </motion.div>
      )}
    </div>
  )
}
