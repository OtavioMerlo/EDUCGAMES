import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'

const CATS = ['GAME', 'SUBSCRIPTION', 'GIFT_CARD', 'ITEM', 'COSMETIC']
const RARITIES = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY']

export default function AdminStore() {
  const [showForm, setShowForm] = useState(false)
  const qc = useQueryClient()
  const { register, handleSubmit, reset } = useForm()

  const { data } = useQuery({
    queryKey: ['admin-rewards'],
    queryFn: () => api.get('/rewards?limit=50').then(r => r.data)
  })

  const createMutation = useMutation({
    mutationFn: (d) => api.post('/rewards', { ...d, price: Number(d.price), stock: Number(d.stock) }),
    onSuccess: () => {
      toast.success('Recompensa criada!')
      qc.invalidateQueries(['admin-rewards'])
      setShowForm(false)
      reset()
    },
    onError: () => toast.error('Erro ao criar recompensa')
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/rewards/${id}`),
    onSuccess: () => { toast.success('Desativada!'); qc.invalidateQueries(['admin-rewards']) }
  })

  const inp = { background: 'rgba(255,255,255,.04)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: "'Exo 2',sans-serif" }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold">Marketplace 🛍️</h1>
        <button onClick={() => setShowForm(p => !p)}
          className="flex items-center gap-2 btn-primary"
          style={{ width: 'auto', padding: '10px 20px', fontSize: 14 }}>
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancelar' : 'Nova Recompensa'}
        </button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit(d => createMutation.mutate(d))}
          className="p-6 rounded-2xl mb-6" style={{ background: 'var(--inp)', border: '1px solid var(--border)' }}>
          <h2 className="font-display text-lg font-bold mb-4">Nova Recompensa</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Título" {...register('title', { required: true })} className="p-3 rounded-xl text-sm outline-none" style={inp} />
            <input type="text" placeholder="Emoji (ex: 🎮)" {...register('emoji')} defaultValue="🎁" className="p-3 rounded-xl text-sm outline-none" style={inp} />
            <input type="text" placeholder="Descrição" {...register('description')} className="p-3 rounded-xl text-sm outline-none sm:col-span-2" style={inp} />
            <input type="number" placeholder="Preço em moedas" {...register('price', { required: true })} className="p-3 rounded-xl text-sm outline-none" style={inp} />
            <input type="number" placeholder="Estoque (-1 = ilimitado)" {...register('stock')} defaultValue={-1} className="p-3 rounded-xl text-sm outline-none" style={inp} />
            <select {...register('category')} className="p-3 rounded-xl text-sm outline-none" style={inp}>
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select {...register('rarity')} className="p-3 rounded-xl text-sm outline-none" style={inp}>
              {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button type="submit" disabled={createMutation.isPending} className="btn-primary mt-4">
            {createMutation.isPending ? 'Criando...' : '✅ Criar Recompensa'}
          </button>
        </motion.form>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(data?.rewards || []).map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="p-4 rounded-2xl" style={{ background: 'var(--inp)', border: '1px solid var(--border)' }}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{r.emoji}</span>
                <div>
                  <div className="font-semibold text-sm">{r.title}</div>
                  <div className="text-[var(--muted)] text-xs">{r.category} • {r.rarity}</div>
                </div>
              </div>
              <button onClick={() => deleteMutation.mutate(r.id)}
                className="text-[var(--muted)] hover:text-[#ef4444] transition-colors p-1">
                <X size={14} />
              </button>
            </div>
            <p className="text-[var(--muted)] text-xs mb-3 line-clamp-2">{r.description}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#fbbf24] font-bold">🪙 {r.price.toLocaleString('pt-BR')}</span>
              <span className="text-[var(--muted)] text-xs">
                Estoque: {r.stock === -1 ? '∞' : r.stock}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {(!data?.rewards || data.rewards.length === 0) && (
        <div className="text-center py-16 text-[var(--muted)]">Nenhuma recompensa cadastrada</div>
      )}
    </div>
  )
}
