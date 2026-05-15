import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ChevronLeft, ShoppingBag, CheckCircle2, ShieldCheck, Zap, Info } from 'lucide-react'
import api from '../../services/api'
import useAuthStore from '../../store/useAuthStore'
import AvatarWithAura from '../../components/ui/AvatarWithAura'
import RewardImage from '../../components/ui/RewardImage'
import toast from 'react-hot-toast'

const RARITY = {
  COMMON: { label: 'Comum', color: '#9ca3af' },
  RARE: { label: 'Raro', color: '#60a5fa' },
  EPIC: { label: 'Épico', color: '#a78bfa' },
  LEGENDARY: { label: 'Lendário', color: '#fbbf24' },
}

export default function RewardDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { user, updateUser } = useAuthStore()

  const { data: reward, isLoading } = useQuery({
    queryKey: ['reward', id],
    queryFn: () => api.get('/rewards').then(r => r.data.rewards.find(x => x.id === id))
  })

  const { data: myPurchases = [] } = useQuery({
    queryKey: ['my-purchases'],
    queryFn: () => api.get('/rewards/my-purchases').then(r => r.data)
  })

  const { data: freshUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/auth/me').then(r => r.data)
  })

  const buyMutation = useMutation({
    mutationFn: () => api.post('/rewards/purchase', { rewardId: id }),
    onSuccess: ({ data: res }) => {
      toast.success(`${res.reward.emoji} Adquirido com sucesso!`)
      qc.invalidateQueries(['me'])
      qc.invalidateQueries(['my-purchases'])
      updateUser({ coins: (freshUser?.coins || user?.coins) - res.coinsSpent })
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Erro na compra')
  })

  if (isLoading || !reward) return <div className="p-20 text-center">Carregando...</div>

  const isOwned = myPurchases.some(p => p.rewardId === id)
  const r = RARITY[reward.rarity]
  const currentUser = freshUser || user
  const canBuy = !isOwned && (currentUser?.coins || 0) >= reward.price && (reward.stock === -1 || reward.stock > 0)

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[var(--muted)] hover:text-white mb-6 transition-colors">
        <ChevronLeft size={20} /> Voltar para a Loja
      </button>

      <div className="grid lg:grid-cols-[1fr_350px] gap-8">
        <div className="flex flex-col gap-6">
          {/* Card de Visualização Profissional */}
          <div className={`relative rounded-3xl overflow-hidden flex items-center justify-center ${
            reward.category === 'SUBSCRIPTION'
              ? 'premium-service-card border-none shadow-2xl'
              : reward.rarity === 'LEGENDARY' 
                ? 'legendary-card border-none shadow-2xl' 
                : 'glass border border-white/10 shadow-xl'
          } aspect-video lg:h-[450px]`}>
            {reward.rarity === 'LEGENDARY' && <div className="legendary-glow" />}
            {reward.category === 'SUBSCRIPTION' && <div className="service-glow" />}
            
            <div className="absolute inset-0 opacity-40" style={{ background: reward.bgGradient }} />
            
            <RewardImage 
              imageUrl={reward.imageUrl} 
              emoji={reward.emoji} 
              title={reward.title} 
              rarity={reward.rarity}
              containerClassName="h-full w-full"
              className="scale-110" // Zoom leve para detalhes
            />

            {reward.category === 'COSMETIC' && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <AvatarWithAura user={{ ...currentUser, equippedAura: reward.title }} size="xl" />
                <div className="text-center mt-6">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-white/50 mb-1">Pré-visualização</div>
                  <div className="text-sm font-bold text-white/80">Como ficará no seu perfil</div>
                </div>
              </div>
            )}
          </div>

          {/* Descrição e Instruções */}
          <div className="rounded-3xl p-8 glass border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                style={{ background: `${r.color}22`, color: r.color, border: `1px solid ${r.color}44` }}>
                {r.label}
              </div>
              <div className="text-[var(--muted)] text-xs font-bold uppercase tracking-widest">{reward.category}</div>
            </div>
            
            <h1 className={`font-display text-4xl font-bold mb-4 ${reward.rarity === 'LEGENDARY' ? 'font-premium-display gold-text !text-5xl tracking-tight' : ''}`}>
              {reward.title}
            </h1>
            <p className={`text-[var(--muted)] text-lg leading-relaxed mb-8 ${reward.rarity === 'LEGENDARY' ? 'font-premium-body text-white/80' : ''}`}>
              {reward.description}
            </p>

            <div className="space-y-6">
              <h3 className="font-display text-xl font-bold flex items-center gap-2">
                <Info className="text-[var(--purple-l)]" size={20} /> Como funciona?
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-[var(--purple-l)] mb-2"><ShieldCheck size={24} /></div>
                  <div className="font-bold text-sm mb-1">Resgate Seguro</div>
                  <div className="text-xs text-[var(--muted)]">Todos os nossos itens são verificados e entregues instantaneamente ou em até 24h.</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-[var(--cyan)] mb-2"><Zap size={24} /></div>
                  <div className="font-bold text-sm mb-1">Ativação Imediata</div>
                  <div className="text-xs text-[var(--muted)]">Itens cosméticos podem ser equipados na hora através do seu perfil.</div>
                </div>
              </div>

              {reward.category === 'SUBSCRIPTION' && (
                <div className="p-6 rounded-2xl bg-[var(--purple-l)]/10 border border-[var(--purple-l)]/20">
                  <h4 className="font-bold text-sm mb-2 text-[var(--purple-l)]">Instruções de Resgate:</h4>
                  <ul className="text-xs text-[var(--muted)] space-y-2 list-disc list-inside">
                    <li>Clique em "Resgatar" e confirme a transação.</li>
                    <li>Vá até o seu <b>Histórico de Compras</b> no menu lateral.</li>
                    <li>O código ou link de ativação estará disponível nos detalhes da compra.</li>
                    <li>Siga as instruções específicas do provedor (Spotify, Netflix, etc) para ativar.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar de Compra */}
        <div className="flex flex-col gap-4">
          <div className="sticky top-24 rounded-3xl p-6 glass border border-white/10 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <div className="text-xs text-[var(--muted)] font-bold uppercase tracking-widest">Preço do Item</div>
              <div className="flex items-center gap-2">
                <span className="text-3xl">🪙</span>
                <span className="font-display text-4xl font-black text-[#fbbf24]">{reward.price.toLocaleString('pt-BR')}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[var(--muted)]">Seu Saldo:</span>
                <span className="font-bold text-[#fbbf24]">🪙 {(currentUser?.coins || 0).toLocaleString()}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-[#fbbf24] transition-all" 
                  style={{ width: `${Math.min(100, ((currentUser?.coins || 0) / reward.price) * 100)}%` }} />
              </div>
            </div>

            <button onClick={() => buyMutation.mutate()}
              disabled={!canBuy || buyMutation.isPending}
              className={`w-full py-4 rounded-2xl font-display text-lg font-black uppercase tracking-widest transition-all shadow-glow ${
                isOwned 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                : canBuy 
                  ? reward.rarity === 'LEGENDARY'
                    ? 'bg-gradient-to-r from-[#CA8A04] to-[#fde68a] text-black hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(202,138,4,0.6)]'
                    : 'bg-white text-black hover:bg-[var(--cyan)] hover:scale-[1.02]' 
                  : 'bg-white/5 text-[var(--muted)] cursor-not-allowed'
              }`}>
              {isOwned ? (
                <span className="flex items-center justify-center gap-2"><CheckCircle2 size={20}/> Adquirido</span>
              ) : buyMutation.isPending ? 'Processando...' : 
                canBuy ? 'Resgatar Agora' : 'Moedas Insuficientes'}
            </button>

            <div className="text-center">
              <span className="text-[10px] text-[var(--muted)] uppercase font-bold tracking-tighter">
                {reward.stock === -1 ? 'Estoque Ilimitado' : `${reward.stock} unidades disponíveis`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
