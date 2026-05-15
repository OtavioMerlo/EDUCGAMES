import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Hammer, ArrowLeft, Construction, Clock } from 'lucide-react'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0f0f2e]">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-md w-full text-center"
      >
        <div className="mb-8 flex justify-center">
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              y: [0, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-24 h-24 rounded-3xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.2)]"
          >
            <Construction size={48} className="text-amber-400" />
          </motion.div>
        </div>

        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">
          Em Manutenção <span className="text-amber-400">!</span>
        </h1>
        
        <div className="glass border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl mb-8">
          <div className="flex items-center justify-center gap-3 mb-6 text-amber-400/80 font-bold uppercase tracking-widest text-xs">
            <Clock size={14} />
            Recuperação de Senha
          </div>
          
          <p className="text-[var(--muted)] leading-relaxed mb-0 font-medium">
            Opa! Ainda estamos trabalhando nesta funcionalidade. Por enquanto, a recuperação de senha automática ainda não está funcionando.
          </p>
          
          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-sm text-white/40 mb-2 italic">Dica para a feira:</p>
            <p className="text-sm text-white/60">
              Use o login padrão do sistema para demonstração ou peça ajuda ao administrador.
            </p>
          </div>
        </div>

        <Link to="/login">
          <motion.button
            whileHover={{ x: -4 }}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors font-bold text-sm"
          >
            <ArrowLeft size={16} />
            Voltar para o Login
          </motion.button>
        </Link>
      </motion.div>
    </div>
  )
}
