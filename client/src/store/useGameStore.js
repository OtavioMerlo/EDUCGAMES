import { create } from 'zustand'

const useGameStore = create((set, get) => ({
  // XP animation
  xpGainAmount: 0,
  showXpGain: false,
  // Level up
  showLevelUp: false,
  newLevel: 0,
  // Achievement unlock
  showAchievement: false,
  achievement: null,

  triggerXpGain: (amount) => {
    set({ xpGainAmount: amount, showXpGain: true })
    setTimeout(() => set({ showXpGain: false }), 2000)
  },

  triggerLevelUp: (level) => {
    set({ showLevelUp: true, newLevel: level })
    setTimeout(() => set({ showLevelUp: false }), 4000)
  },

  triggerAchievement: (achievement) => {
    set({ showAchievement: true, achievement })
    setTimeout(() => set({ showAchievement: false }), 5000)
  },
}))

export default useGameStore
