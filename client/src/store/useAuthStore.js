import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        const { data } = await api.post('/auth/login', { email, password })
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
          isLoading: false,
        })
        return data
      },

      register: async (payload) => {
        set({ isLoading: true })
        const { data } = await api.post('/auth/register', payload)
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
          isLoading: false,
        })
        return data
      },

      logout: async () => {
        const { refreshToken } = get()
        await api.post('/auth/logout', { refreshToken }).catch(() => {})
        localStorage.clear()
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
      },

      refreshUser: async () => {
        const { data } = await api.get('/auth/me')
        set({ user: data })
        return data
      },

      updateUser: (updates) => set((s) => ({ user: { ...s.user, ...updates } })),

      setLoading: (v) => set({ isLoading: v }),
    }),
    {
      name: 'educagames-auth',
      partialize: (s) => ({ user: s.user, accessToken: s.accessToken, refreshToken: s.refreshToken, isAuthenticated: s.isAuthenticated }),
    }
  )
)

export default useAuthStore
