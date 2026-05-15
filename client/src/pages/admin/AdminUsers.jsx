import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Search, Filter, Edit2, Trash2, Shield, 
  ChevronLeft, ChevronRight, X, Mail, Calendar, 
  Zap, Coins, Trophy, Ban, CheckCircle, MoreVertical
} from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import Skeleton from '../../components/ui/Skeleton'

// ── User Edit Modal ────────────────────────────────────────────────────────
function UserEditModal({ user, onClose }) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    level: user.level,
    xp: user.xp,
    coins: user.coins,
    bio: user.bio || ''
  })

  const mutation = useMutation({
    mutationFn: (data) => api.patch(`/admin/users/${user.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users'])
      toast.success('Usuário atualizado!')
      onClose()
    },
    onError: () => toast.error('Erro ao atualizar.')
  })

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl glass border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center font-black">{user.name.charAt(0)}</div>
            <div>
              <h2 className="text-xl font-black text-white">Editar Jogador</h2>
              <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">{user.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-[var(--muted)]"><X size={20} /></button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Nome Completo</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full glass-input px-4 py-3 rounded-xl border border-white/10 outline-none focus:border-purple-500/50 transition-all text-sm font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">E-mail</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full glass-input px-4 py-3 rounded-xl border border-white/10 outline-none focus:border-purple-500/50 transition-all text-sm font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Cargo</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-[#0a0a25] px-4 py-3 rounded-xl border border-white/10 outline-none focus:border-purple-500/50 transition-all text-sm font-bold appearance-none">
                <option value="STUDENT">Aluno</option>
                <option value="TEACHER">Professor</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Nível</label>
              <input type="number" value={formData.level} onChange={e => setFormData({...formData, level: Number(e.target.value)})} className="w-full glass-input px-4 py-3 rounded-xl border border-white/10 outline-none focus:border-purple-500/50 transition-all text-sm font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">XP Total</label>
              <input type="number" value={formData.xp} onChange={e => setFormData({...formData, xp: Number(e.target.value)})} className="w-full glass-input px-4 py-3 rounded-xl border border-white/10 outline-none focus:border-purple-500/50 transition-all text-sm font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Moedas (🪙)</label>
              <input type="number" value={formData.coins} onChange={e => setFormData({...formData, coins: Number(e.target.value)})} className="w-full glass-input px-4 py-3 rounded-xl border border-white/10 outline-none focus:border-purple-500/50 transition-all text-sm font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Bio / Status</label>
              <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full glass-input px-4 py-3 rounded-xl border border-white/10 outline-none focus:border-purple-500/50 transition-all text-sm font-medium h-20 resize-none" />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 bg-white/5 flex items-center justify-end gap-4">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold text-[var(--muted)] hover:text-white transition-colors uppercase tracking-widest">Cancelar</button>
          <button onClick={() => mutation.mutate(formData)} disabled={mutation.isPending} className="btn-primary px-8 py-2.5 rounded-xl font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50">
            {mutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── User Management Page ───────────────────────────────────────────────────
export default function AdminUsers() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [editingUser, setEditingUser] = useState(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, search, roleFilter],
    queryFn: () => api.get(`/admin/users?page=${page}&search=${search}&role=${roleFilter}`).then(r => r.data),
    placeholderData: (prev) => prev
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users'])
      toast.success('Usuário excluído com sucesso.')
    }
  })

  const handleDelete = (u) => {
    if (confirm(`Tem certeza que deseja excluir permanentemente o usuário ${u.name}? Esta ação é irreversível!`)) {
      deleteMutation.mutate(u.id)
    }
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-1 flex items-center gap-3">
             <Users size={32} className="text-purple-400" />
             Usuários
          </h1>
          <p className="text-[var(--muted)] font-medium">Gerencie permissões, economia e moderação de jogadores.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-purple-400 transition-colors" />
            <input type="text" placeholder="Buscar por nome ou e-mail..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-12 pr-4 py-3 rounded-2xl glass border border-white/10 outline-none focus:border-purple-500/40 transition-all text-sm w-full sm:w-80" />
          </div>
          <div className="relative">
             <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
             <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
               className="pl-12 pr-8 py-3 rounded-2xl glass border border-white/10 outline-none focus:border-purple-500/40 transition-all text-sm appearance-none font-bold">
               <option value="">Todos os Cargos</option>
               <option value="STUDENT">Alunos</option>
               <option value="TEACHER">Professores</option>
               <option value="ADMIN">Admins</option>
             </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="glass border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-[var(--muted)] border-b border-white/5">
                <th className="px-6 py-5">Usuário</th>
                <th className="px-6 py-5">Status / Cargo</th>
                <th className="px-6 py-5">Progresso</th>
                <th className="px-6 py-5">Economia</th>
                <th className="px-6 py-5">Criado em</th>
                <th className="px-6 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}><td colSpan="6" className="px-6 py-4"><Skeleton className="h-12 w-full rounded-xl" /></td></tr>
                ))
              ) : data?.users?.map(u => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-purple-400 group-hover:scale-110 transition-transform">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-black text-white">{u.name}</div>
                        <div className="text-[10px] text-[var(--muted)] font-medium flex items-center gap-1"><Mail size={10} /> {u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                         u.role === 'ADMIN' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                         u.role === 'TEACHER' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' :
                         'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                       }`}>
                         {u.role}
                       </span>
                       <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-500/10 text-green-400 text-[9px] font-black uppercase tracking-widest border border-green-500/10">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                         Ativo
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[100px] h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: `${(u.xp % 1000) / 10}%` }} />
                      </div>
                      <div className="text-[10px] font-black text-white uppercase tracking-tighter">Nv. {u.level}</div>
                    </div>
                    <div className="text-[9px] text-[var(--muted)] font-bold mt-1 uppercase">{u.xp?.toLocaleString('pt-BR')} XP TOTAL</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm font-black text-yellow-400">🪙 {u.coins?.toLocaleString('pt-BR')}</div>
                      <div className="text-[9px] text-[var(--muted)] font-bold uppercase tracking-widest flex items-center gap-1"><Trophy size={10} /> Streak: {u.streak}d</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider flex items-center gap-2">
                       <Calendar size={12} className="opacity-40" />
                       {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setEditingUser(u)} className="p-2 rounded-xl bg-white/5 hover:bg-purple-500/20 text-[var(--muted)] hover:text-purple-400 transition-all cursor-pointer">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-[var(--muted)] hover:text-red-400 transition-all cursor-pointer">
                        <Ban size={16} />
                      </button>
                      <button onClick={() => handleDelete(u)} className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-[var(--muted)] hover:text-red-400 transition-all cursor-pointer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
          <p className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">
            Exibindo {data?.users?.length || 0} de {data?.total || 0} usuários
          </p>
          <div className="flex items-center gap-3">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all">
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-black px-4 py-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {page}
            </span>
            <button onClick={() => setPage(p => p + 1)} disabled={!data || data.users.length < 20}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {editingUser && (
          <UserEditModal user={editingUser} onClose={() => setEditingUser(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
