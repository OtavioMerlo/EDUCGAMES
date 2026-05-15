import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Users, ShoppingBag, Gamepad2, Command, Star, Trophy, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'
import AvatarWithAura from './AvatarWithAura'
import RewardImage from './RewardImage'
import { Highlight } from './Highlight'

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recent_searches')
    return saved ? JSON.parse(saved) : []
  })
  const navigate = useNavigate()
  const inputRef = useRef(null)

  // Save to history helper
  const addToHistory = useCallback((item) => {
    const historyItem = {
      id: item.id,
      name: item.name || item.title,
      type: item.type,
      avatarColor: item.avatarColor,
      imageUrl: item.imageUrl,
      emoji: item.emoji,
      rarity: item.rarity,
      timestamp: Date.now()
    }
    
    setRecentSearches(prev => {
      const filtered = prev.filter(i => i.id !== item.id)
      const updated = [historyItem, ...filtered].slice(0, 5)
      localStorage.setItem('recent_searches', JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearHistory = () => {
    setRecentSearches([])
    localStorage.removeItem('recent_searches')
  }

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  const { data, isLoading } = useQuery({
    queryKey: ['global-search', debouncedQuery],
    queryFn: () => api.get(`/search/global?q=${encodeURIComponent(debouncedQuery)}`).then(r => r.data),
    enabled: debouncedQuery.length >= 2,
    staleTime: 60_000
  })

  const results = [
    ...(data?.users?.map(u => ({ ...u, type: 'user' })) || []),
    ...(data?.rewards?.map(r => ({ ...r, type: 'reward' })) || [])
  ]

  const displayResults = query.length < 2 ? recentSearches : results

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [displayResults.length])

  const handleSelect = useCallback((item) => {
    addToHistory(item)
    setIsOpen(false)
    setQuery('')
    if (item.type === 'user') {
      navigate(`/profile/${item.id}`)
    } else {
      navigate('/store')
    }
  }, [navigate, addToHistory])

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % Math.max(displayResults.length, 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + displayResults.length) % Math.max(displayResults.length, 1))
    } else if (e.key === 'Enter' && displayResults[selectedIndex]) {
      handleSelect(displayResults[selectedIndex])
    }
  }

  return (
    <>
      {/* Desktop Search Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="hidden lg:flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[var(--muted)] hover:text-white hover:bg-white/10 transition-all cursor-pointer group"
      >
        <Search size={16} />
        <span className="text-sm font-medium">Pesquisar...</span>
        <div className="flex items-center gap-1 ml-auto px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-bold group-hover:bg-purple-500/20 group-hover:text-purple-400">
          <Command size={10} /> K
        </div>
      </button>

      {/* Mobile Search Icon */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-[var(--muted)]"
      >
        <Search size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl glass border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
              onKeyDown={handleKeyDown}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-white/10">
                <Search className="text-purple-400" size={22} />
                <input
                  ref={inputRef}
                  autoFocus
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Pesquisar por jogadores, itens, jogos..."
                  className="flex-1 bg-transparent border-none outline-none text-[var(--text)] text-lg placeholder:text-[var(--muted)]"
                />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-[var(--muted)] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Results Area */}
              <div className="max-h-[60vh] overflow-y-auto scrollbar-thin p-2">
                {query.length < 2 ? (
                  <div className="p-2">
                    {recentSearches.length > 0 ? (
                      <>
                        <div className="flex items-center justify-between px-3 py-2 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">
                          <span>Pesquisas Recentes</span>
                          <button onClick={clearHistory} className="hover:text-red-400 transition-colors">Limpar</button>
                        </div>
                        <div className="space-y-1 mt-1">
                          {recentSearches.map((item, idx) => (
                            <button
                              key={`recent-${item.id}`}
                              onClick={() => handleSelect(item)}
                              onMouseEnter={() => setSelectedIndex(idx)}
                              className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all text-left group ${
                                selectedIndex === idx ? 'bg-purple-500/20 border-purple-500/30' : 'hover:bg-white/5'
                              }`}
                            >
                              <div className="w-10 h-10 flex-shrink-0">
                                {item.type === 'user' ? (
                                  <AvatarWithAura user={item} size="sm" showAccessory={true} />
                                ) : (
                                  <div className="h-full rounded-xl overflow-hidden bg-black/40 border border-white/10">
                                      <RewardImage imageUrl={item.imageUrl} emoji={item.emoji} title={item.name} rarity={item.rarity} containerClassName="h-full" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-[var(--text)] text-sm">{item.name}</div>
                                <div className="text-[10px] text-[var(--muted)] uppercase">{item.type}</div>
                              </div>
                              <ArrowRight size={14} className={`text-purple-400 transition-opacity ${selectedIndex === idx ? 'opacity-100' : 'opacity-0'}`} />
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center text-center opacity-50">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                          <Command size={32} />
                        </div>
                        <p className="text-sm font-medium">Digite pelo menos 2 caracteres</p>
                        <p className="text-xs mt-1">Busca inteligente por nomes, biografia ou itens</p>
                      </div>
                    )}
                  </div>
                ) : isLoading ? (
                  <div className="space-y-2 p-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />
                    ))}
                  </div>
                ) : results.length === 0 ? (
                  <div className="py-12 text-center opacity-50">
                    <p className="text-sm">Nenhum resultado encontrado para "{query}"</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {displayResults.map((item, idx) => (
                      <button
                        key={`${item.type}-${item.id}`}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all text-left group ${
                          selectedIndex === idx ? 'bg-purple-500/20 border-purple-500/30' : 'hover:bg-white/5'
                        }`}
                      >
                        {/* Preview Icon/Avatar */}
                        <div className="w-12 h-12 flex-shrink-0">
                          {item.type === 'user' ? (
                            <AvatarWithAura user={item} size="md" showAccessory={true} />
                          ) : (
                            <div className="h-full rounded-xl overflow-hidden bg-black/40 border border-white/10">
                                <RewardImage imageUrl={item.imageUrl} emoji={item.emoji} title={item.title} rarity={item.rarity} containerClassName="h-full" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[var(--text)]">
                              <Highlight text={item.name || item.title} query={query} />
                            </span>
                            {item.type === 'user' && (
                              <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase">
                                Nv. {item.level}
                              </span>
                            )}
                            {item.type === 'reward' && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase">
                                {item.category}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[var(--muted)] truncate">
                            {item.bio || item.description || 'Sem descrição'}
                          </div>
                        </div>

                        {/* Right Action */}
                        <div className={`transition-all ${selectedIndex === idx ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
                          <ArrowRight size={18} className="text-purple-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-black/40 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1 rounded">↑↓</kbd> Navegar</span>
                  <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1 rounded">↵</kbd> Selecionar</span>
                  <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1 rounded">ESC</kbd> Fechar</span>
                </div>
                <div>
                   EducaGames Search v2.0
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
