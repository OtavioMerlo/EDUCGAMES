/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#07071a',
        bg2: '#0d0d2b',
        bg3: '#10102e',
        purple: { DEFAULT: '#7c3aed', light: '#a855f7', dark: '#6d28d9' },
        pink: '#ec4899',
        cyan: '#22d3ee',
        gold: '#fbbf24',
        surface: 'rgba(255,255,255,0.05)',
        border: 'rgba(130,100,255,0.2)',
      },
      fontFamily: {
        sans: ['"Exo 2"', 'sans-serif'],
        display: ['Rajdhani', 'sans-serif'],
      },
      backgroundImage: {
        grad: 'linear-gradient(135deg,#8b5cf6,#a855f7 50%,#ec4899)',
        'grad-gold': 'linear-gradient(135deg,#fbbf24,#d97706)',
        'grad-cyan': 'linear-gradient(135deg,#22d3ee,#0891b2)',
      },
      boxShadow: {
        glow: '0 0 28px rgba(168,85,247,.55), 0 6px 24px rgba(236,72,153,.35)',
        'glow-lg': '0 0 48px rgba(168,85,247,.7), 0 8px 32px rgba(236,72,153,.5)',
        'glow-gold': '0 0 20px rgba(251,191,36,.4)',
      },
      animation: {
        float: 'float 3.5s ease-in-out infinite',
        spin: 'spin 4s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
        'fade-up': 'fadeUp .4s ease both',
        'slide-in': 'slideIn .5s ease both',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-soft': 'bounceSoft .6s ease both',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% center' }, '100%': { backgroundPosition: '200% center' } },
        fadeUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(-20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        bounceSoft: { '0%': { transform: 'scale(0.8)', opacity: '0' }, '60%': { transform: 'scale(1.05)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}
