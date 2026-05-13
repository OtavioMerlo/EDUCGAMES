import { motion, AnimatePresence } from 'framer-motion'
import useGameStore from '../../store/useGameStore'

export default function GameOverlay() {
  const { showXpGain, xpGainAmount, showLevelUp, newLevel, showAchievement, achievement } = useGameStore()

  return (
    <>
      {/* XP Gain Float */}
      <AnimatePresence>
        {showXpGain && (
          <motion.div
            key="xp-gain"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -60 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="fixed top-1/2 left-1/2 z-[9999] pointer-events-none"
            style={{ transform: 'translate(-50%, -50%)' }}>
            <span className="font-display text-3xl font-bold" style={{
              background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 12px rgba(168,85,247,.8))'
            }}>
              +{xpGainAmount} XP ⭐
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Banner */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            key="level-up"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none">
            <div className="relative text-center p-12 rounded-3xl glass border border-[var(--border)]"
              style={{ boxShadow: 'var(--glow-lg)' }}>
              <div className="text-7xl mb-4 animate-bounce-soft">🎉</div>
              <div className="font-display text-4xl font-bold mb-2 grad-text">LEVEL UP!</div>
              <div className="font-display text-7xl font-bold mb-3" style={{
                background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>{newLevel}</div>
              <div className="text-[var(--muted)] text-lg">Você avançou para o nível {newLevel}!</div>
              <div className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, rgba(168,85,247,.15), transparent 70%)' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Unlock */}
      <AnimatePresence>
        {showAchievement && achievement && (
          <motion.div
            key="achievement"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-4 z-[9997] max-w-xs">
            <div className="flex items-center gap-3 p-4 rounded-2xl glass"
              style={{ border: '1px solid rgba(251,191,36,.4)', boxShadow: '0 0 20px rgba(251,191,36,.2)' }}>
              <div className="text-3xl flex-shrink-0">{achievement.emoji}</div>
              <div>
                <div className="text-[10px] font-bold tracking-wider uppercase text-[#fbbf24] mb-0.5">Conquista Desbloqueada!</div>
                <div className="font-semibold text-sm">{achievement.title}</div>
                <div className="text-[11px] text-[var(--muted)]">{achievement.description}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
