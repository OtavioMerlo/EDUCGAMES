import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const qc = useQueryClient()

  const { data } = useQuery({
    queryKey: ['admin-users', search, role],
    queryFn: () => api.get('/admin/users', { params: { search: search || undefined, role: role || undefined } }).then(r => r.data)
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...body }) => api.patch(`/admin/users/${id}`, body),
    onSuccess: () => { toast.success('Usuário atualizado!'); qc.invalidateQueries(['admin-users']) }
  })

  const users = data?.users || []

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Usuários 👥</h1>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--hint)]" />
          <input type="text" placeholder="Buscar por nome ou email..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="input-field" />
        </div>
        <select value={role} onChange={e => setRole(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: 'var(--inp)', border: '1px solid var(--border)', color: 'var(--text)' }}>
          <option value="">Todos os papéis</option>
          <option value="STUDENT">Alunos</option>
          <option value="TEACHER">Professores</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div className="grid grid-cols-6 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] px-5 py-3"
          style={{ background: 'rgba(255,255,255,.03)', borderBottom: '1px solid var(--border)' }}>
          <span className="col-span-2">Usuário</span><span>Papel</span><span>XP</span><span>Moedas</span><span>Ações</span>
        </div>
        {users.map((u, i) => (
          <motion.div key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
            className="grid grid-cols-6 items-center px-5 py-3 border-b last:border-0"
            style={{ borderColor: 'var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.01)' }}>
            <div className="col-span-2 min-w-0">
              <div className="font-medium text-sm truncate">{u.name}</div>
              <div className="text-[var(--muted)] text-xs truncate">{u.email}</div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full w-fit font-bold"
              style={{ color: u.role === 'ADMIN' ? '#a78bfa' : u.role === 'TEACHER' ? '#22d3ee' : '#10b981',
                background: u.role === 'ADMIN' ? 'rgba(167,139,250,.1)' : u.role === 'TEACHER' ? 'rgba(34,211,238,.1)' : 'rgba(16,185,129,.1)' }}>
              {u.role}
            </span>
            <span className="text-sm text-[#a78bfa]">{u.xp?.toLocaleString('pt-BR')}</span>
            <span className="text-sm text-[#fbbf24]">🪙 {u.coins?.toLocaleString('pt-BR')}</span>
            <div className="flex gap-2">
              <button onClick={() => updateMutation.mutate({ id: u.id, coins: u.coins + 100 })}
                className="text-[10px] px-2 py-1 rounded-lg font-bold text-[#fbbf24] hover:bg-yellow-500/10 transition-colors">
                +100🪙
              </button>
            </div>
          </motion.div>
        ))}
        {users.length === 0 && <div className="text-center py-12 text-[var(--muted)]">Nenhum usuário encontrado</div>}
      </div>
    </div>
  )
}
