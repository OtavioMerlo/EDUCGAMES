import { motion, AnimatePresence } from 'framer-motion'

const AURAS = {
  'Aura Super Saiyajin': { color: '#fbbf24', secondary: '#fff7ed', type: 'aggressive' },
  'Aura Kaioken': { color: '#ef4444', secondary: '#450a0a', type: 'aggressive' },
  'Aura SSJ Blue': { color: '#3b82f6', secondary: '#eff6ff', type: 'aggressive' },
  'Aura Instinto Superior': { color: '#e2e8f0', secondary: '#ffffff', type: 'ghost' },
  'Aura SSJ God': { color: '#f43f5e', secondary: '#fb7185', type: 'aggressive' },
  'Aura SSJ Rosé': { color: '#d946ef', secondary: '#f5d0fe', type: 'aggressive' },
  'Aura Lendário': { color: '#fbbf24', secondary: '#7c3aed', type: 'legendary' },
  'Aura Broly Lendário': { color: '#22c55e', secondary: '#f0fdf4', type: 'aggressive' },
  'Efeito Fogos Artificiais': { color: '#ec4899', type: 'particles' },
  'Efeito Confetes': { color: '#facc15', type: 'confetti' },
  'Efeito Fogos Azuis': { color: '#06b6d4', type: 'particles' },
}

export default function AvatarWithAura({ user, size = 'md', className = '' }) {
  const aura = user?.equippedAura ? AURAS[user.equippedAura] : null
  const initials = user?.name?.charAt(0).toUpperCase() || '?'
  
  const sizes = {
    xs: 'w-8 h-8 text-[10px]',
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-xl',
    lg: 'w-20 h-20 text-3xl',
    xl: 'w-24 h-24 text-4xl',
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Aura Layer */}
      <AnimatePresence>
        {aura && (
          <div className="absolute inset-0 z-0 scale-[1.65] pointer-events-none">
            
            {/* Estilo Agressivo (Chamas Espetadas estilo Dragon Ball) */}
            {aura.type === 'aggressive' && (
              <>
                {/* Brilho Externo Difuso */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 blur-2xl rounded-full" style={{ background: aura.color }} />
                
                {/* Chamas Internas Espetadas (Layer 1) */}
                <motion.div animate={{ 
                    scale: [1, 1.05, 0.98, 1.02],
                    rotate: [0, 1, -1, 0],
                    opacity: [0.6, 0.9, 0.7] 
                  }}
                  transition={{ duration: 0.15, repeat: Infinity }}
                  className="absolute inset-0 flex items-center justify-center">
                   <svg viewBox="0 0 100 100" className="w-full h-full fill-current" style={{ color: aura.color, filter: 'blur(2px)' }}>
                      <path d="M50 0 L60 20 L80 10 L70 35 L100 30 L85 55 L95 80 L70 70 L50 100 L30 70 L5 80 L15 55 L0 30 L30 35 L20 10 L40 20 Z" />
                   </svg>
                </motion.div>

                {/* Núcleo de Brilho (Layer 2) */}
                <motion.div animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 0.1, repeat: Infinity }}
                  className="absolute inset-0 flex items-center justify-center scale-75">
                   <svg viewBox="0 0 100 100" className="w-full h-full fill-current" style={{ color: '#fff', opacity: 0.5, filter: 'blur(4px)' }}>
                      <path d="M50 5 L55 25 L75 15 L65 40 L90 35 L75 55 L85 75 L65 65 L50 90 L35 65 L15 75 L25 55 L10 35 L35 40 L25 25 L45 25 Z" />
                   </svg>
                </motion.div>

                {/* Partículas subindo */}
                {[...Array(4)].map((_, i) => (
                  <motion.div key={i} animate={{ y: [0, -60], x: [0, (i%2?10:-10)], opacity: [0, 1, 0], scale: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                    className="absolute bottom-1/2 left-1/2 w-1.5 h-1.5 rounded-full" style={{ background: aura.secondary || '#fff' }} />
                ))}
              </>
            )}

            {/* Aura Lendária: O ápice */}
            {aura.type === 'legendary' && (
              <>
                <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 blur-3xl rounded-full" style={{ background: `radial-gradient(circle, ${aura.color}, ${aura.secondary})` }} />
                
                {/* Shockwaves */}
                {[...Array(2)].map((_, i) => (
                  <motion.div key={i} animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.75 }}
                    className="absolute inset-0 border-2 rounded-full" style={{ borderColor: aura.color }} />
                ))}

                <motion.div animate={{ scale: [1, 1.1, 0.9, 1.05], rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 0.1, repeat: Infinity }}
                  className="absolute inset-0 flex items-center justify-center">
                   <svg viewBox="0 0 100 100" className="w-full h-full fill-current" style={{ color: aura.color, filter: 'drop-shadow(0 0 10px #fff)' }}>
                      <path d="M50 0 L65 15 L90 5 L80 30 L100 45 L75 55 L85 85 L50 70 L15 85 L25 55 L0 45 L20 30 L10 5 L35 15 Z" />
                   </svg>
                </motion.div>

                {/* Dark Particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div key={i} animate={{ 
                    y: [0, -80], 
                    x: [0, (i % 2 ? 15 : -15)], 
                    opacity: [0, 1, 0], 
                    scale: [1.5, 0],
                    rotate: [0, 180] 
                  }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  className="absolute bottom-1/2 left-1/2 w-2 h-2" style={{ background: aura.secondary, borderRadius: '2px' }} />
                ))}
              </>
            )}
            
            {aura.type === 'ghost' && (
              <motion.div animate={{ opacity: [0.2, 0.5, 0.2], filter: ['blur(10px)', 'blur(20px)', 'blur(10px)'] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute inset-0 border-4 rounded-full" style={{ borderColor: aura.color, boxShadow: `0 0 40px ${aura.color}` }} />
            )}

            {(aura.type === 'particles' || aura.type === 'confetti') && (
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <motion.div key={i} animate={{ 
                    y: [-10, -60], 
                    x: [0, (i % 2 === 0 ? 30 : -30)],
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0],
                    rotate: [0, 360]
                  }} transition={{ duration: 1 + Math.random(), repeat: Infinity, delay: i * 0.15 }}
                  className={`absolute top-1/2 left-1/2 ${aura.type === 'confetti' ? 'w-2 h-1' : 'w-1.5 h-1.5 rounded-full'}`} 
                  style={{ background: aura.color }} />
                ))}
              </div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Avatar Circle */}
      <div className={`${sizes[size]} rounded-full flex items-center justify-center font-bold relative z-10 shadow-xl border-2 border-white/20`}
        style={{ background: user?.avatarColor || 'var(--grad)' }}>
        {initials}
      </div>

      {/* Level Badge */}
      {(size === 'lg' || size === 'xl') && (
        <div className="absolute -bottom-1 -right-1 z-20 px-2 py-0.5 rounded-full text-[10px] font-black shadow-lg"
          style={{ background: 'var(--grad)', color: '#fff' }}>
          Nv.{user?.level}
        </div>
      )}
    </div>
  )
}
