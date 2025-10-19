import { create } from 'zustand'

export const useStore = create((set) => ({
  hobby: 'Chess',
  level: 'beginner',
  plan: null,
  progress: {},
  setHobby: (hobby) => set({ hobby }),
  setLevel: (level) => set({ level }),
  setPlan: (plan) => set({ plan }),
  setProgress: (progress) => set({ progress }),
}))
