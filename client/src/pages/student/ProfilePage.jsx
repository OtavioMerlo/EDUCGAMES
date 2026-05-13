import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { User, Mail, Award, Calendar } from 'lucide-react'
import api from '../../services/api'
import useAuthStore from '../../store/useAuthStore'
import toast from 'react-hot-toast'
import AvatarWithAura from '../../components/ui/AvatarWithAura'

const COLORS = ['#7c3aed','#ec4899','#22d3ee','#10b981','#f59e0b','#6366f1','#ef4444','#06b6d4','#a855f7','#f97316']

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [selectedColor, setSelectedColor] = useState(user?.avatarColor || '#7c3aed')
  const qc = useQueryClient()

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/users/profile').then(r => r.data)
  })


  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.name, bio: user?.bio || '' }
  })

  const updateMutation = useMutation({
    mutationFn: (data) => api.put('/users/profile', data),
    onSuccess: ({ data }) => {
      updateUser(data)
      qc.invalidateQueries(['profile'])
      toast.success('Perfil atualizado!')
    },
    onError: () => toast.error('Erro ao atualizar perfil')
  })


  const onSubmit = (data) => updateMutation.mutate({ ...data, avatarColor: selectedColor })

  const p = profile || user

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <h1 className="font-display text-3xl font-bold mb-6">Perfil 👤</h1>

      {/* Avatar Header */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-8 rounded-3xl glass border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{ background: `radial-gradient(circle at center, ${p?.avatarColor}, transparent 70%)` }} />
        
        <div className="relative flex-shrink-0">
          <AvatarWithAura user={{ ...p, avatarColor: selectedColor }} size="xl" />
        </div>

        <div className="text-center sm:text-left z-10">
          <div className="font-display text-2xl font-bold mb-1">{p?.name}</div>
          <div className="text-[var(--muted)] text-sm mb-4">{p?.email}</div>
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-bold uppercase tracking-widest">
            <span className="text-[#a78bfa]">{(p?.xp || 0).toLocaleString()} XP</span>
            <span className="text-[#fbbf24]">🪙 {(p?.coins || 0).toLocaleString()}</span>
            <span className="text-[#f472b6]">🔥 {p?.streak} dias</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6">

        {/* Edit Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl p-6 glass border border-white/10">
          <h2 className="font-display text-lg font-bold mb-5">Editar Perfil</h2>

          <div className="mb-4">
            <label className="text-[11px] text-[var(--muted)] font-bold uppercase tracking-wider mb-2 block">Nome Público</label>
            <input type="text" {...register('name')} className="input-field" style={{ paddingLeft: '16px' }} />
          </div>

          <div className="mb-5">
            <label className="text-[11px] text-[var(--muted)] font-bold uppercase tracking-wider mb-2 block">Sua Bio</label>
            <textarea {...register('bio')} rows={3} placeholder="Escreva algo sobre você..."
              className="w-full p-4 rounded-xl text-sm resize-none outline-none border border-white/10 bg-white/5 text-[var(--text)]" />
          </div>

          <div className="mb-6">
            <label className="text-[11px] text-[var(--muted)] font-bold uppercase tracking-wider mb-3 block">Cor Base do Avatar</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setSelectedColor(c)}
                  className="w-8 h-8 rounded-full transition-all"
                  style={{ 
                    background: c, 
                    boxShadow: selectedColor === c ? `0 0 0 3px var(--bg), 0 0 0 5px ${c}` : 'none', 
                    transform: selectedColor === c ? 'scale(1.15)' : 'scale(1)' 
                  }} />
              ))}
            </div>
          </div>

          <button type="submit" disabled={updateMutation.isPending} className="btn-primary">
            {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  )
}
