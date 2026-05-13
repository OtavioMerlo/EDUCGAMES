import { motion } from 'framer-motion'

export default function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'var(--bg)' }}>
      <div className="blobs"><div className="blob b1"/><div className="blob b2"/><div className="blob b3"/></div>
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative w-20 h-20">
          <div className="logo-ring"/>
          <div className="relative w-full h-full rounded-[18px] flex items-center justify-center" style={{ background: 'var(--bg2)' }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10">
              <defs><linearGradient id="plg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a855f7"/><stop offset="100%" stopColor="#22d3ee"/>
              </linearGradient></defs>
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="url(#plg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="url(#plg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div className="flex gap-1.5">
          {[0,1,2].map(i => (
            <motion.div key={i} className="w-2 h-2 rounded-full"
              style={{ background: 'var(--purple-l)' }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
          ))}
        </div>
      </div>
    </div>
  )
}
