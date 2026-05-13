import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, Gamepad2, Gift, Music, Search, Filter, 
  Check, Play, ExternalLink, Info, LayoutGrid, List
} from 'lucide-react'
import api from '../../services/api'
import useAuthStore from '../../store/useAuthStore'
import toast from 'react-hot-toast'
import AvatarWithAura from '../../components/ui/AvatarWithAura'

const CATEGORIES = [
  { id: 'ALL', label: 'Todos', icon: LayoutGrid, color: 'text-white' },
  { id: 'COSMETIC', label: 'Auras', icon: Sparkles, color: 'text-purple-400' },
  { id: 'GAME', label: 'Jogos', icon: Gamepad2, color: 'text-blue-400' },
  { id: 'GIFT_CARD', label: 'Gifts', icon: Gift, color: 'text-pink-400' },
  { id: 'SUBSCRIPTION', label: 'Spotify', icon: Music, color: 'text-green-400' },
]

export default function InventoryPage() {
  const { user, updateUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const qc = useQueryClient()

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/users/profile').then(r => r.data)
  })

  const { data: purchases = [], isLoading } = useQuery({
    queryKey: ['my-purchases'],
    queryFn: () => api.get('/rewards/my-purchases').then(r => r.data)
  })

  const equipMutation = useMutation({
    mutationFn: (auraId) => api.patch('/users/profile/equip-aura', { auraId }),
    onSuccess: ({ data }) => {
      updateUser({ equippedAura: data.equippedAura })
      qc.invalidateQueries(['profile'])
      toast.success(data.equippedAura ? '✨ Efeito visual equipado!' : 'Efeito removido.')
    },
    onError: () => toast.error('Erro ao equipar item.')
  })

  const filteredItems = purchases.filter(p => {
    const matchesTab = activeTab === 'ALL' || p.reward.category === activeTab
    const matchesSearch = p.reward.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const p = profile || user

  return (
    <div className="min-h-screen pb-20 font-['Chakra_Petch']">
      <header className="mb-10">
         <h1 className="text-4xl font-['Russo_One'] text-white uppercase tracking-tighter mb-2 flex items-center gap-3">
            Seu Inventário <LayoutGrid className="text-purple-500" />
         </h1>
         <p className="text-[var(--muted)]">Gerencie seus itens, skins e recompensas desbloqueadas.</p>
      </header>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar Controls */}
        <aside className="space-y-6">
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all text-sm"
            />
          </div>

          {/* Categories */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-4 space-y-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-white/30 px-3 mb-2 block">Categorias</span>
            {CATEGORIES.map(cat => {
              const Icon = cat.icon
              const active = activeTab === cat.id
              return (
                <button 
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'hover:bg-white/5 text-[var(--muted)]'
                  }`}
                >
                  <Icon size={18} className={active ? 'text-white' : cat.color} />
                  <span className="text-sm font-bold">{cat.label}</span>
                  {active && <motion.div layoutId="activeTab" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
                </button>
              )
            })}
          </div>

          {/* Profile Quick Stats */}
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/10 rounded-[2rem] p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full" />
             <div className="relative z-10 flex flex-col items-center text-center">
                <AvatarWithAura user={p} size="lg" />
                <h3 className="mt-4 font-bold text-lg">{p?.name}</h3>
                <span className="text-xs text-purple-400 font-black uppercase tracking-widest">Nível {p?.level}</span>
             </div>
          </div>
        </aside>

        {/* Items Grid */}
        <main>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
               {[...Array(8)].map((_, i) => (
                 <div key={i} className="aspect-square rounded-[2rem] bg-white/5 animate-pulse" />
               ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
               <AnimatePresence mode="popLayout">
                 {filteredItems.map(item => (
                   <InventoryCard 
                     key={item.id} 
                     item={item} 
                     isEquipped={p?.equippedAura === item.reward.title}
                     onEquip={() => equipMutation.mutate(item.reward.title)}
                     isEquipping={equipMutation.isPending}
                   />
                 ))}
               </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
               <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Search size={32} className="text-white/20" />
               </div>
               <h3 className="text-xl font-bold text-white/50">Nenhum item encontrado</h3>
               <p className="text-sm text-white/30 mt-2">Explore a loja para desbloquear novas recompensas!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function InventoryCard({ item, isEquipped, onEquip, isEquipping }) {
  const r = item.reward
  const isCosmetic = r.category === 'COSMETIC'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className={`relative group rounded-[2.5rem] p-1 bg-gradient-to-br transition-all ${
        isEquipped ? 'from-purple-500 to-blue-500 shadow-lg shadow-purple-500/20' : 'from-white/10 to-transparent'
      }`}
    >
      <div className="bg-[#0f0f1a] rounded-[calc(2.5rem-4px)] p-5 h-full flex flex-col items-center text-center">
        {/* Category Icon Badge */}
        <div className="absolute top-4 left-4">
           {r.category === 'COSMETIC' && <Sparkles size={14} className="text-purple-400" />}
           {r.category === 'GAME' && <Gamepad2 size={14} className="text-blue-400" />}
           {r.category === 'GIFT_CARD' && <Gift size={14} className="text-pink-400" />}
           {r.category === 'SUBSCRIPTION' && <Music size={14} className="text-green-400" />}
        </div>

        {/* Action Button for non-cosmetics */}
        {!isCosmetic && (
          <div className="absolute top-4 right-4">
             <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 cursor-pointer">
                <ExternalLink size={14} className="text-[var(--muted)]" />
             </div>
          </div>
        )}

        <div className="w-full aspect-square flex items-center justify-center mb-4 relative">
           {isCosmetic ? (
              <div className="scale-125">
                 <AvatarWithAura user={{ equippedAura: r.title, avatarColor: '#7c3aed' }} size="md" />
              </div>
           ) : (
              <span className="text-6xl drop-shadow-2xl">{r.emoji}</span>
           )}

           {isEquipped && (
             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
               className="absolute bottom-0 right-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center border-4 border-[#0f0f1a] shadow-xl">
               <Check size={16} className="text-white" strokeWidth={3} />
             </motion.div>
           )}
        </div>

        <h4 className="font-['Russo_One'] text-sm text-white uppercase tracking-tight mb-1 line-clamp-1">
          {r.title}
        </h4>
        <p className="text-[10px] text-[var(--muted)] font-black uppercase tracking-widest mb-4">
           {r.category === 'SUBSCRIPTION' ? 'Spotify Reward' : r.category}
        </p>

        {isCosmetic && (
          <button 
            onClick={onEquip}
            disabled={isEquipping || isEquipped}
            className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2
            ${isEquipped ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-white/5 hover:bg-white/10 text-white'}
            `}
          >
            {isEquipped ? 'Equipado' : 'Equipar'}
          </button>
        )}

        {!isCosmetic && (
          <button className="w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all flex items-center justify-center gap-2">
            Ver Detalhes
          </button>
        )}
      </div>
    </motion.div>
  )
}
