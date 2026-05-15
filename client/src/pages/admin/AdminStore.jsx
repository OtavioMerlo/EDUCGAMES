import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, Plus, Search, Filter, Edit2, Trash2, 
  X, Tag, Sparkles, Image as ImageIcon, CheckCircle, 
  Eye, Save, AlertCircle, Coins
} from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import Skeleton from '../../components/ui/Skeleton'
import RewardImage from '../../components/ui/RewardImage'

const CATEGORIES = ['AURA', 'ACCESSORY', 'BADGE', 'EFFECT', 'SKIN', 'PASS']
const RARITIES = [
  { val: 'COMMON', label: 'Comum', color: '#94a3b8' },
  { val: 'UNCOMMON', label: 'Incomum', color: '#4ade80' },
  { val: 'RARE', label: 'Raro', color: '#3b82f6' },
  { val: 'EPIC', label: 'Épico', color: '#a855f7' },
  { val: 'LEGENDARY', label: 'Lendário', color: '#eab308' },
  { val: 'MYTHIC', label: 'Mítico', color: '#f43f5e' },
]

// ── Reward Edit Modal ──────────────────────────────────────────────────────
function RewardModal({ reward, onClose }) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState(reward || {
    title: '',
    description: '',
    price: 0,
    category: 'AURA',
    rarity: 'COMMON',
    imageUrl: '',
    emoji: '',
    isActive: true
  })

  const mutation = useMutation({
    mutationFn: (data) => reward 
      ? api.put(`/admin/rewards/${reward.id}`, data) 
      : api.post('/admin/rewards', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-rewards'])
      toast.success(reward ? 'Item atualizado!' : 'Item criado com sucesso!')
      onClose()
    },
    onError: () => toast.error('Erro ao salvar item.')
  })

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl glass border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* Form Area */}
        <div className="flex-1 p-8 space-y-6 max-h-[80vh] overflow-y-auto scrollbar-thin">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/20">
              <Plus size={24} />
            </div>
            <h2 className="text-2xl font-black text-white">{reward ? 'Editar Item' : 'Novo Item'}</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Título do Item</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full glass-input px-4 py-3 rounded-xl border border-white/10 outline-none focus:border-purple-500/50 transition-all text-sm font-bold" placeholder="Ex: Aura de Fogo" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Preço (🪙)</label>
              <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full glass-input px-4 py-3 rounded-xl border border-white/10 outline-none focus:border-purple-500/50 transition-all text-sm font-bold" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Descrição</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full glass-input px-4 py-3 rounded-xl border border-white/10 outline-none focus:border-purple-500/50 transition-all text-sm font-medium h-24 resize-none" placeholder="O que este item faz?" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Categoria</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#0a0a25] px-4 py-3 rounded-xl border border-white/10 outline-none focus:border-purple-500/50 transition-all text-sm font-bold appearance-none">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Raridade</label>
              <select value={formData.rarity} onChange={e => setFormData({...formData, rarity: e.target.value})} className="w-full bg-[#0a0a25] px-4 py-3 rounded-xl border border-white/10 outline-none focus:border-purple-500/50 transition-all text-sm font-bold appearance-none">
                {RARITIES.map(r => <option key={r.val} value={r.val}>{r.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">URL da Imagem</label>
              <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full glass-input px-4 py-3 rounded-xl border border-white/10 outline-none focus:border-purple-500/50 transition-all text-sm font-bold" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Emoji (Opcional)</label>
              <input type="text" value={formData.emoji} onChange={e => setFormData({...formData, emoji: e.target.value})} className="w-full glass-input px-4 py-3 rounded-xl border border-white/10 outline-none focus:border-purple-500/50 transition-all text-sm font-bold" placeholder="🔥" />
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="w-full md:w-80 bg-black/40 border-l border-white/10 p-8 flex flex-col items-center justify-center space-y-6">
           <div className="text-[10px] font-black uppercase text-purple-400 tracking-widest mb-2">Prévia do Item</div>
           <div className="w-48 h-64 rounded-3xl glass border border-white/10 p-4 flex flex-col items-center justify-between text-center relative group overflow-hidden shadow-2xl">
              {/* Rarity Glow */}
              <div className="absolute inset-0 opacity-10 blur-xl pointer-events-none" style={{ background: RARITIES.find(r => r.val === formData.rarity)?.color }} />
              
              <div className="w-32 h-32 flex-shrink-0">
                <RewardImage imageUrl={formData.imageUrl} emoji={formData.emoji} title={formData.title} rarity={formData.rarity} containerClassName="h-full" />
              </div>

              <div>
                <div className="text-xs font-black text-white mb-1 uppercase tracking-tight">{formData.title || 'Novo Item'}</div>
                <div className="text-[9px] font-bold px-2 py-0.5 rounded-full inline-block" style={{ color: RARITIES.find(r => r.val === formData.rarity)?.color, background: `${RARITIES.find(r => r.val === formData.rarity)?.color}20` }}>
                  {RARITIES.find(r => r.val === formData.rarity)?.label}
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-black text-yellow-400">
                <Coins size={12} />
                {formData.price.toLocaleString('pt-BR')}
              </div>
           </div>

           <div className="space-y-4 w-full">
             <button onClick={() => mutation.mutate(formData)} disabled={mutation.isPending} className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(168,85,247,0.3)]">
               <Save size={18} />
               {mutation.isPending ? 'Salvando...' : 'Salvar Item'}
             </button>
             <button onClick={onClose} className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-[var(--muted)] font-black uppercase tracking-widest text-[10px] transition-all">
               Cancelar
             </button>
           </div>
        </div>
      </motion.div>
    </div>
  )
}

// ── Admin Store Page ───────────────────────────────────────────────────────
export default function AdminStore() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReward, setEditingReward] = useState(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-rewards'],
    queryFn: () => api.get('/admin/rewards').then(r => r.data)
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/rewards/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-rewards'])
      toast.success('Item removido!')
    }
  })

  const rewards = data || []
  const filtered = rewards.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'ALL' || r.category === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-1 flex items-center gap-3">
             <ShoppingBag size={32} className="text-yellow-400" />
             Marketplace Admin
          </h1>
          <p className="text-[var(--muted)] font-medium">Crie e gerencie itens da loja, raridades e economia.</p>
        </div>

        <button onClick={() => { setEditingReward(null); setIsModalOpen(true); }} className="btn-primary px-8 py-3.5 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(168,85,247,0.4)]">
          <Plus size={20} />
          Novo Item
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl glass border border-white/10">
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setFilter('ALL')} className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'ALL' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : 'bg-white/5 text-[var(--muted)] hover:bg-white/10'}`}>Todos</button>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setFilter(c)} className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === c ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : 'bg-white/5 text-[var(--muted)] hover:bg-white/10'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="relative">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
           <input type="text" placeholder="Filtrar itens..." value={search} onChange={e => setSearch(e.target.value)} className="pl-12 pr-6 py-2 rounded-xl glass border border-white/10 outline-none text-sm w-full sm:w-64" />
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          [...Array(8)].map((_, i) => <Skeleton key={i} className="h-64 rounded-3xl" />)
        ) : filtered.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="group relative p-6 rounded-3xl glass border border-white/10 hover:border-purple-500/40 transition-all flex flex-col items-center text-center">
            
            <div className="w-24 h-24 mb-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
               <RewardImage imageUrl={r.imageUrl} emoji={r.emoji} title={r.title} rarity={r.rarity} containerClassName="h-full" />
            </div>

            <div className="mb-4">
               <div className="text-sm font-black text-white uppercase tracking-tight mb-1">{r.title}</div>
               <div className="text-[9px] font-black px-2 py-0.5 rounded-full inline-block" style={{ color: RARITIES.find(rar => rar.val === r.rarity)?.color, background: `${RARITIES.find(rar => rar.val === r.rarity)?.color}15` }}>
                 {r.rarity}
               </div>
            </div>

            <div className="text-lg font-black text-yellow-400 mb-6">🪙 {r.price.toLocaleString('pt-BR')}</div>

            <div className="flex items-center gap-2 w-full mt-auto">
               <button onClick={() => { setEditingReward(r); setIsModalOpen(true); }} className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-purple-500/20 text-[var(--muted)] hover:text-purple-400 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest">
                 <Edit2 size={14} /> Editar
               </button>
               <button onClick={() => deleteMutation.mutate(r.id)} className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-[var(--muted)] hover:text-red-400 transition-all">
                 <Trash2 size={16} />
               </button>
            </div>

            {/* Status Badge */}
            {!r.isActive && (
              <div className="absolute top-4 left-4 flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/10 text-red-400 text-[8px] font-black uppercase tracking-widest border border-red-500/20">
                <AlertCircle size={10} /> Inativo
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <RewardModal reward={editingReward} onClose={() => { setIsModalOpen(false); setEditingReward(null); }} />
        )}
      </AnimatePresence>
    </div>
  )
}
