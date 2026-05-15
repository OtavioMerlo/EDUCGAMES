import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ShoppingBag, Star, Zap, Gift, Smartphone, Layout, Sparkles, CheckCircle2, Flame } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import useAuthStore from '../../store/useAuthStore'
import toast from 'react-hot-toast'
import { formatCompact } from '../../utils/format'
import RewardImage from '../../components/ui/RewardImage'

const RARITY = {
  COMMON: { label: 'Comum', color: '#9ca3af', glow: 'rgba(156,163,175,.2)' },
  RARE: { label: 'Raro', color: '#60a5fa', glow: 'rgba(96,165,250,.2)' },
  EPIC: { label: 'Épico', color: '#a78bfa', glow: 'rgba(167,139,250,.2)' },
  LEGENDARY: { label: 'Lendário', color: '#fbbf24', glow: 'rgba(251,191,36,.2)' },
}

const CATS = [
  { id: '', label: '🚀 Tudo', icon: Layout },
  { id: 'GAME', label: '🎮 Jogos', icon: Zap },
  { id: 'COSMETIC', label: '✨ Auras', icon: Sparkles },
  { id: 'SUBSCRIPTION', label: '📱 Assinaturas', icon: Smartphone },
  { id: 'GIFT_CARD', label: '🎁 Gift Cards', icon: Gift },
  { id: 'ITEM', label: '⚡ Itens', icon: Star },
]

export default function StorePage() {
  const [cat, setCat] = useState('')
  const { user, updateUser } = useAuthStore()
  const qc = useQueryClient()

  const { data: freshUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/auth/me').then(r => r.data)
  })

  const { data: myPurchases = [] } = useQuery({
    queryKey: ['my-purchases'],
    queryFn: () => api.get('/rewards/my-purchases').then(r => r.data)
  })

  const { data, isLoading } = useQuery({
    queryKey: ['rewards', cat],
    queryFn: () => api.get('/rewards', { params: { category: cat || undefined, limit: 50 } }).then(r => r.data)
  })

  // Criar um Set com os IDs das recompensas que o usuário já possui
  const ownedRewardIds = new Set(myPurchases.map(p => p.rewardId))

  const buyMutation = useMutation({
    mutationFn: (rewardId) => api.post('/rewards/purchase', { rewardId }),
    onSuccess: ({ data: res }) => {
      toast.success(`${res.reward.emoji} resgatado com sucesso!`)
      qc.invalidateQueries(['me'])
      qc.invalidateQueries(['my-purchases'])
      qc.invalidateQueries(['rewards'])
      updateUser({ coins: (freshUser?.coins || user?.coins) - res.coinsSpent })
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Erro na compra')
  })

  const currentUser = freshUser || user
  const rewards = data?.rewards || []

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">Loja de Recompensas <ShoppingBag className="text-[#a78bfa]" /></h1>
          <p className="text-[var(--muted)] text-sm">Troque suas moedas de estudo por prêmios reais.</p>
        </div>
        
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl glass border border-[#fbbf24]/30">
          <div className="text-xl">🪙</div>
          <div>
            <div className="font-display text-2xl font-black text-[#fbbf24] leading-none">{formatCompact(currentUser?.coins || 0)}</div>
            <div className="text-[10px] text-[var(--muted)] uppercase font-bold tracking-widest">Suas Moedas</div>
          </div>
        </div>
      </div>

      {/* Banner Loja24 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative group mb-10 p-1 rounded-3xl overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
        <Link to="/loja24" className="block relative bg-[var(--bg2)] rounded-[calc(1.5rem+4px)] p-6 md:p-8 overflow-hidden transition-transform group-hover:scale-[0.995]">
          {/* Effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-[100px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 blur-[100px] -ml-32 -mb-32" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest border border-red-500/30 mb-4 animate-pulse">
                <Flame size={12} fill="currentColor" /> Evento Diário Exclusivo
              </div>
              <h2 className="text-4xl md:text-6xl font-['Russo_One'] text-[var(--text)] uppercase tracking-tighter leading-none mb-4">
                Loja<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">24</span>
              </h2>
              <p className="text-[var(--muted)] max-w-md">
                Ofertas raras com descontos de até <span className="text-[var(--text)] font-bold">80% OFF</span>. 
                Os itens mudam em 24h. Não perca!
              </p>
            </div>

            <div className="relative flex items-center justify-center p-8 bg-white/5 rounded-full border border-white/10 group-hover:border-purple-500/50 transition-colors">
               <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                 className="absolute inset-0 border-2 border-dashed border-purple-500/30 rounded-full" />
               <Zap size={48} className="text-purple-500 filter drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" fill="currentColor" />
               <div className="absolute -bottom-4 bg-white text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-xl font-['Chakra_Petch']">
                 Ver Ofertas
               </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Categorias */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {CATS.map(c => {
          const Icon = c.icon
          const active = cat === c.id
          return (
            <button key={c.label} onClick={() => setCat(c.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                active ? 'bg-white text-black border-white shadow-glow' : 'bg-white/5 text-[var(--muted)] border-white/10 hover:bg-white/10'
              }`}>
              <Icon size={16} /> {c.label}
            </button>
          )
        })}
      </div>

      {/* Grid de Recompensas */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="h-64 rounded-2xl animate-pulse bg-white/5" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {rewards.map((reward, i) => {
            const r = RARITY[reward.rarity]
            const isOwned = ownedRewardIds.has(reward.id)
            const canBuy = !isOwned && (currentUser?.coins || 0) >= reward.price && (reward.stock === -1 || reward.stock > 0)
            
            return (
              <motion.div key={reward.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className={`relative flex flex-col rounded-3xl overflow-hidden group transition-all ${
                  reward.category === 'SUBSCRIPTION'
                    ? 'premium-service-card border-none shadow-2xl'
                    : reward.rarity === 'LEGENDARY' 
                      ? 'legendary-card border-none shadow-2xl' 
                      : `glass border border-white/10 ${isOwned ? 'opacity-80' : ''} hover:border-[var(--purple-l)]/40`
                }`}>
                
                {reward.rarity === 'LEGENDARY' && <div className="legendary-glow" />}
                {reward.category === 'SUBSCRIPTION' && <div className="service-glow" />}

                <Link to={`/store/${reward.id}`} className="block relative z-10">
                  {/* Header do Item */}
                  <div className={`h-48 relative overflow-hidden ${reward.rarity === 'LEGENDARY' ? 'h-56' : ''}`} 
                    style={{ background: reward.bgGradient }}>
                    
                    <RewardImage 
                      imageUrl={reward.imageUrl} 
                      emoji={reward.emoji} 
                      title={reward.title} 
                      rarity={reward.rarity}
                      containerClassName="h-full"
                    />

                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter z-20"
                      style={{ background: 'rgba(0,0,0,0.7)', color: r.color, border: `1px solid ${r.color}66`, backdropFilter: 'blur(4px)' }}>
                      {r.label}
                    </div>

                    {reward.rarity === 'LEGENDARY' && (
                      <div className="absolute top-3 left-3 z-20">
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#CA8A04] text-black text-[9px] font-black uppercase tracking-widest shadow-lg animate-pulse">
                          <Star size={10} fill="currentColor" /> Premium
                        </div>
                      </div>
                    )}

                    {isOwned && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-30">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest shadow-xl">
                          <CheckCircle2 size={12} /> Adquirido
                        </div>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col relative z-10">
                  <Link to={`/store/${reward.id}`}>
                    <h3 className={`font-bold text-sm mb-1 truncate transition-colors ${
                      reward.rarity === 'LEGENDARY' ? 'font-premium-display text-lg gold-text' : 'group-hover:text-[var(--purple-l)]'
                    }`}>
                      {reward.title}
                    </h3>
                  </Link>
                  <p className={`text-[var(--muted)] text-[11px] leading-relaxed mb-4 line-clamp-2 h-8 ${
                    reward.rarity === 'LEGENDARY' ? 'font-premium-body text-white/70' : ''
                  }`}>
                    {reward.description}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <span className="text-sm">🪙</span>
                        <span className={`font-display text-lg font-black ${reward.rarity === 'LEGENDARY' ? 'text-[#fde68a] text-xl drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'text-[#fbbf24]'}`}>
                          {formatCompact(reward.price)}
                        </span>
                      </div>
                      {reward.stock !== -1 && (
                        <span className="text-[9px] text-[var(--muted)] font-bold uppercase">Estoque: {reward.stock}</span>
                      )}
                    </div>

                    <button onClick={() => buyMutation.mutate(reward.id)}
                      disabled={!canBuy || buyMutation.isPending}
                      className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        isOwned 
                        ? 'bg-white/10 text-[var(--muted)] cursor-default'
                        : canBuy 
                          ? reward.rarity === 'LEGENDARY'
                            ? 'bg-gradient-to-r from-[#CA8A04] to-[#fde68a] text-black hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(202,138,4,0.4)]'
                            : 'bg-white text-black hover:bg-[var(--cyan)] hover:shadow-glow' 
                          : 'bg-white/5 text-[var(--muted)] cursor-not-allowed border border-white/5'
                      }`}>
                      {isOwned ? 'Já Possui' :
                       buyMutation.isPending ? 'Processando...' : 
                       !canBuy && (currentUser?.coins || 0) < reward.price ? 'Moedas Insuficientes' : 
                       reward.stock === 0 ? 'Esgotado' : 'Resgatar'}
                    </button>
                  </div>
                </div>

                {!isOwned && reward.rarity !== 'LEGENDARY' && (
                   <div className="absolute inset-0 pointer-events-none group-hover:border-[var(--cyan)]/30 transition-colors border-2 border-transparent rounded-2xl" />
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && rewards.length === 0 && (
        <div className="text-center py-24 glass rounded-3xl">
          <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
          <h2 className="text-xl font-bold opacity-50">Nenhum item encontrado nesta categoria</h2>
          <p className="text-sm text-[var(--muted)] mt-2">Tente explorar outras áreas da loja!</p>
        </div>
      )}
    </div>
  )
}
