import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Sparkles, Timer, Zap, ShoppingBag, Trophy, Flame, Info, CheckCircle2, ChevronRight, Star, Coins } from 'lucide-react'
import api from '../../services/api'
import { toast } from 'react-hot-toast'
import confetti from 'canvas-confetti'
import AvatarWithAura from '../../components/ui/AvatarWithAura'
import { formatCompact } from '../../utils/format'

const RARITY_CONFIG = {
  COMMON: { 
    label: 'Comum', 
    color: '#9ca3af', 
    glow: '0 0 20px rgba(156,163,175,0.3)', 
    bg: 'rgba(156,163,175,0.1)',
    animation: { scale: [1, 1.02, 1], opacity: [0.7, 1, 0.7] }
  },
  RARE: { 
    label: 'Raro', 
    color: '#60a5fa', 
    glow: '0 0 30px rgba(96,165,250,0.5)', 
    bg: 'rgba(96,165,250,0.15)',
    animation: { scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }
  },
  EPIC: { 
    label: 'Épico', 
    color: '#a78bfa', 
    glow: '0 0 40px rgba(167,139,250,0.6)', 
    bg: 'rgba(167,139,250,0.2)',
    animation: { scale: [1, 1.1, 1], y: [0, -5, 0] }
  },
  LEGENDARY: { 
    label: 'Lendário', 
    color: '#fbbf24', 
    glow: '0 0 60px rgba(251,191,36,0.8)', 
    bg: 'rgba(251,191,36,0.25)',
    animation: { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] }
  },
}

export default function Loja24Page() {
  const queryClient = useQueryClient()
  const [showCeremony, setShowCeremony] = useState(false)
  const [revealedItems, setRevealedItems] = useState([])
  const [timeLeft, setTimeLeft] = useState('')
  const ceremonyStarted = useRef(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['loja24'],
    queryFn: () => api.get('/loja24').then(r => r.data),
    retry: 1
  })

  const { data: user } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/users/profile').then(r => r.data)
  })

  const { data: myPurchases = [] } = useQuery({
    queryKey: ['my-purchases'],
    queryFn: () => api.get('/rewards/my-purchases').then(r => r.data)
  })

  const ownedRewardIds = new Set(myPurchases.map(p => p.rewardId))

  const purchaseMutation = useMutation({
    mutationFn: (id) => api.post('/loja24/purchase', { dailyStoreItemId: id }),
    onSuccess: (res) => {
      toast.success(res.data.message)
      queryClient.invalidateQueries(['loja24'])
      queryClient.invalidateQueries(['profile'])
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7c3aed', '#f43f5e', '#fbbf24']
      })
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Erro ao comprar item.')
  })

  const markSeenMutation = useMutation({
    mutationFn: () => api.post('/loja24/seen')
  })

  // Timer logic
  useEffect(() => {
    if (!data?.nextReset) return
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const diff = data.nextReset - now
      if (diff <= 0) {
        setTimeLeft('EXPIRANDO...')
        clearInterval(interval)
        // Trigger refetch and new ceremony
        queryClient.invalidateQueries(['loja24'])
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60))
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const s = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [data?.nextReset, queryClient])

  // Initial access ceremony
  useEffect(() => {
    if (data?.isFirstAccess && !isLoading && !ceremonyStarted.current) {
      ceremonyStarted.current = true
      setShowCeremony(true)
      
      const timeouts = []
      
      // Reveal items one by one
        data.items.forEach((item, index) => {
           const t = setTimeout(() => {
              setRevealedItems(prev => [...prev, item.id])
           }, 1500 + (index * 1200))
           timeouts.push(t)
        })
        
        // Mark as seen after ceremony
        const finalT = setTimeout(() => {
           markSeenMutation.mutate()
        }, 2000 + (data.items.length * 1200))
        timeouts.push(finalT)

      return () => {
        timeouts.forEach(t => clearTimeout(t))
      }
    }
  }, [data?.isFirstAccess, isLoading, data?.items?.length]) // Reduzido dependências

  if (isLoading) return <LojaLoading />

  if (error) return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center p-4">
       <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center max-w-md backdrop-blur-xl">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-white font-['Russo_One'] text-xl mb-2">Erro ao Sincronizar</h2>
          <p className="text-[var(--muted)] text-sm mb-6">
            Não conseguimos carregar suas ofertas personalizadas. Isso geralmente acontece após uma atualização do sistema.
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="w-full py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
          >
            Fazer Login Novamente
          </button>
       </div>
    </div>
  )

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden font-['Chakra_Petch']">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#7c3aed] blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#f43f5e] blur-[150px] rounded-full" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <AnimatePresence>
        {showCeremony && (
          <OpeningCeremony 
            items={data?.items || []} 
            revealedItems={revealedItems} 
            ownedRewardIds={ownedRewardIds}
            onClose={() => setShowCeremony(false)} 
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-2">
               <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-full flex items-center gap-1.5 uppercase tracking-widest animate-pulse">
                  <Flame size={12} fill="currentColor" /> Evento Diário
               </span>
               <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  <Timer size={12} /> {timeLeft} restante
               </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-['Russo_One'] text-white uppercase tracking-tighter leading-none">
               LOJA<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">24</span>
            </h1>
            <p className="text-[var(--muted)] text-lg mt-4 max-w-xl">
               Ofertas exclusivas com preços reduzidos que duram apenas 24 horas. 
               <span className="text-white font-bold ml-1">O estoque reseta à meia-noite!</span>
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-2xl">
            <div className="flex flex-col items-end">
              <span className="text-xs text-[var(--muted)] uppercase font-bold tracking-widest">Seu Saldo</span>
              <span className="text-3xl font-['Russo_One'] text-yellow-400 flex items-center gap-2">
                <Coins size={28} className="text-yellow-400" /> {formatCompact(user?.coins || 0)}
              </span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <button className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-xl hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-purple-500/20">
               <ShoppingBag className="text-white" />
            </button>
          </motion.div>
        </header>

        {/* Grid of Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {data?.items.map((item, idx) => (
            <ItemCard 
              key={item.id} 
              item={item} 
              index={idx} 
              isOwned={ownedRewardIds.has(item.rewardId)}
              onPurchase={() => purchaseMutation.mutate(item.id)}
              isPurchasing={purchaseMutation.isLoading}
            />
          ))}
        </div>

        {/* Footer Info */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <Zap fill="currentColor" />
              </div>
              <div>
                <h4 className="font-bold text-[var(--text)] mb-1 uppercase">Preços Reduzidos</h4>
                <p className="text-sm text-[var(--muted)]">Até 80% de desconto em itens selecionados apenas na Loja24.</p>
              </div>
            </div>
            <div className="flex gap-4">
               <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 shrink-0">
                <Star fill="currentColor" />
              </div>
              <div>
                <h4 className="font-bold text-[var(--text)] mb-1 uppercase">Raridades Diárias</h4>
                <p className="text-sm text-[var(--muted)]">Itens Épicos e Lendários aparecem com mais frequência aqui.</p>
              </div>
            </div>
            <div className="flex gap-4">
               <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Trophy fill="currentColor" />
              </div>
              <div>
                <h4 className="font-bold text-[var(--text)] mb-1 uppercase">Colecionismo</h4>
                <p className="text-sm text-[var(--muted)]">Alguns itens são exclusivos da rotação diária e podem demorar a voltar.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function ItemCard({ item, index, onPurchase, isPurchasing, isOwned }) {
  const config = RARITY_CONFIG[item.reward.rarity]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={!isOwned ? { y: -8, transition: { duration: 0.2 } } : {}}
      className={`group relative ${isOwned ? 'opacity-70 grayscale-[0.5]' : ''}`}
    >
      {/* Glow Effect */}
      {!isOwned && (
        <div className="absolute inset-0 -z-10 rounded-[2.5rem] transition-all duration-500 group-hover:opacity-100 opacity-50"
          style={{ boxShadow: config.glow, background: config.bg }} />
      )}

      <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 h-full flex flex-col items-center text-center overflow-hidden transition-all ${isOwned ? 'bg-black/40' : ''}`}>
        {/* Header Badges */}
        <div className="absolute top-6 left-6 z-20">
          <span className="text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full border backdrop-blur-md"
            style={{ borderColor: `${config.color}44`, color: config.color, background: `${config.color}11` }}>
            {config.label}
          </span>
        </div>

        {/* Discount Badge */}
        {!isOwned && (
          <div className="absolute top-6 right-6 z-20">
             <span className="px-3 py-1 bg-red-500 text-white keep-white text-[10px] font-black rounded-full shadow-lg shadow-red-500/50 uppercase">
                -{item.discount}% OFF
             </span>
          </div>
        )}

        {/* Owned Badge */}
        {isOwned && (
           <div className="absolute top-6 right-6 z-20">
             <span className="px-3 py-1 bg-green-500 text-white keep-white text-[10px] font-black rounded-full shadow-lg shadow-green-500/50 uppercase flex items-center gap-1">
                <CheckCircle2 size={10} /> Adquirido
             </span>
          </div>
        )}

        {/* Item Preview */}
        <div className="relative w-full aspect-square flex items-center justify-center mb-6 mt-8">
           <motion.div animate={!isOwned ? config.animation : {}} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
             className="w-full h-full flex items-center justify-center">
             {item.reward.imageUrl ? (
                <img src={item.reward.imageUrl} alt={item.reward.title} className="w-full h-full object-contain filter drop-shadow-2xl" />
             ) : item.reward.category === 'COSMETIC' ? (
                <div className="scale-150">
                  <AvatarWithAura user={{ equippedAura: item.reward.title, avatarColor: '#7c3aed' }} size="md" />
                </div>
             ) : (
                <span className="text-7xl drop-shadow-2xl">{item.reward.emoji}</span>
             )}
           </motion.div>
           
           {/* Particles for High Rarities */}
           {!isOwned && (item.reward.rarity === 'EPIC' || item.reward.rarity === 'LEGENDARY') && (
             <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div key={i}
                    animate={{ y: [-20, -60], opacity: [0, 1, 0], scale: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    className="absolute bottom-1/2 left-1/2 w-1 h-1 rounded-full"
                    style={{ background: config.color, left: `${40 + Math.random() * 20}%` }} />
                ))}
             </div>
           )}
        </div>

        {/* Info */}
        <h3 className="text-[var(--text)] font-['Russo_One'] text-lg mb-1 leading-tight transition-all">
          {item.reward.title}
        </h3>
        <p className="text-[var(--muted)] text-[10px] uppercase font-bold tracking-widest mb-6 line-clamp-1">
          {item.reward.category}
        </p>

        <div className="mt-auto w-full">
           <div className="flex items-center justify-center gap-2 mb-4">
              <span className={`text-xs ${isOwned ? 'text-[var(--muted)] opacity-50' : 'text-[var(--muted)] line-through'}`}>
                {formatCompact(item.originalPrice)}
              </span>
              <span className={`text-xl font-['Russo_One'] ${isOwned ? 'text-gray-500' : 'text-yellow-400'}`}>
                {formatCompact(item.price)}
              </span>
           </div>

           <button 
             onClick={!isOwned ? onPurchase : undefined}
             disabled={isPurchasing || isOwned}
             className={`w-full py-3 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-2
             ${isPurchasing ? 'opacity-50' : isOwned ? 'bg-white/5 text-[var(--muted)] cursor-default border border-[var(--border)]' : 'hover:scale-[1.02] active:scale-95 shadow-xl text-white keep-white'}
             `}
             style={!isOwned ? { background: config.color, color: '#000', boxShadow: `0 8px 20px ${config.color}44` } : {}}>
             {isPurchasing ? 'Processando...' : isOwned ? 'Já Possui' : 'Resgatar'}
           </button>
        </div>
      </div>
    </motion.div>
  )
}

function OpeningCeremony({ items, revealedItems, onClose, ownedRewardIds }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#050510] flex flex-col items-center justify-center p-6 overflow-hidden"
    >
      {/* Background Particles/Nebula */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] bg-gradient-radial from-purple-500/10 to-transparent blur-[120px]" />
         {[...Array(20)].map((_, i) => (
           <motion.div key={i}
             animate={{ 
               y: [Math.random()*1000, -100], 
               x: [Math.random()*1000, Math.random()*1000],
               opacity: [0, 0.5, 0] 
             }}
             transition={{ duration: 5 + Math.random()*5, repeat: Infinity }}
             className="absolute w-1 h-1 bg-white rounded-full" />
         ))}
      </div>

      <div className="relative z-10 text-center mb-20">
         <motion.h2 
           initial={{ scale: 0.5, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="text-4xl md:text-6xl font-['Russo_One'] text-[var(--text)] uppercase tracking-tighter mb-4"
         >
           Loja Diária Atualizada
         </motion.h2>
         <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
           className="text-purple-400 font-bold uppercase tracking-[0.3em] text-sm">
           Sincronizando novas ofertas...
         </motion.p>
      </div>

      <div className="relative z-10 flex flex-wrap justify-center gap-4 md:gap-8 max-w-6xl">
        {items.map((item, idx) => {
          if (!item.reward) return null
          
          const isRevealed = revealedItems.includes(item.id)
          const config = RARITY_CONFIG[item.reward.rarity] || RARITY_CONFIG.COMMON
          const isOwned = ownedRewardIds?.has?.(item.rewardId) || false
          
          return (
            <motion.div 
              key={item.id}
              initial={{ scale: 0, opacity: 0, rotateY: 180 }}
              animate={{ 
                scale: isRevealed ? 1.1 : 1, 
                opacity: 1, 
                rotateY: isRevealed ? 0 : 180 
              }}
              transition={{ 
                type: 'spring', 
                damping: 12, 
                stiffness: 100,
                delay: 1 + (idx * 0.2) 
              }}
              className="relative w-32 h-48 md:w-48 md:h-72"
            >
              {/* Back of the card */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/30 rounded-2xl flex items-center justify-center shadow-2xl backface-hidden"
                style={{ backfaceVisibility: 'hidden', transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0)' }}>
                 <Zap className="text-purple-500 w-12 h-12 animate-pulse" />
              </div>

              {/* Front of the card */}
              <div className={`absolute inset-0 bg-black border-4 rounded-2xl flex flex-col items-center justify-center p-4 shadow-2xl overflow-hidden transition-all duration-500 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                  borderColor: config.color, 
                  boxShadow: isRevealed ? `0 0 50px ${config.color}66` : 'none',
                  backfaceVisibility: 'hidden', 
                  transform: isRevealed ? 'rotateY(0)' : 'rotateY(-180deg)'
                }}>
                
                {/* Rarity Flare */}
                {isRevealed && (
                  <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-white/20 blur-3xl pointer-events-none" />
                )}

                {isOwned && isRevealed && (
                  <div className="absolute top-2 right-2 z-20">
                    <span className="bg-green-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Adquirido</span>
                  </div>
                )}

                <span className="text-5xl md:text-7xl mb-4 drop-shadow-2xl">{item.reward.emoji}</span>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-center text-[var(--text)] opacity-80">
                   {item.reward.title}
                </span>
                
                <div className="mt-4 px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase keep-white"
                  style={{ background: config.color }}>
                   {config.label}
                </div>
              </div>

              {/* Revealed Burst Effect */}
              {isRevealed && revealedItems[revealedItems.length - 1] === item.id && (
                 <motion.div initial={{ scale: 0, opacity: 1 }} animate={{ scale: 4, opacity: 0 }}
                   className="absolute inset-0 rounded-full border-4 pointer-events-none"
                   style={{ borderColor: config.color }} />
              )}
            </motion.div>
          )
        })}
      </div>

      {revealedItems.length === items.length && (
        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={onClose}
          className="relative z-10 mt-20 px-10 py-4 bg-[var(--text)] text-[var(--bg)] font-['Russo_One'] uppercase tracking-widest rounded-full hover:scale-105 transition-transform active:scale-95 flex items-center gap-3 shadow-2xl"
        >
          Explorar Ofertas <ChevronRight size={20} />
        </motion.button>
      )}
    </motion.div>
  )
}

function LojaLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
       <div className="flex flex-col items-center gap-6">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full shadow-glow" />
          <span className="font-['Russo_One'] text-[var(--text)] uppercase tracking-[0.5em] animate-pulse">Carregando Loja24...</span>
       </div>
    </div>
  )
}
