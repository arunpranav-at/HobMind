import { create } from 'zustand'

// Try to hydrate from localStorage so plans survive reloads
let initial = { hobby: 'Chess', level: 'beginner', plan: null, progress: {} };
try {
  const raw = typeof window !== 'undefined' && window.localStorage.getItem('hobmind_store');
  if (raw) {
    const parsed = JSON.parse(raw);
    initial = { ...initial, ...parsed };
  }
} catch (e) { /* ignore */ }

export const useStore = create((set, get) => ({
  hobby: initial.hobby,
  level: initial.level,
  plan: initial.plan,
  progress: initial.progress,
  setHobby: (hobby) => { set({ hobby }); const s = { ...get() }; try { localStorage.setItem('hobmind_store', JSON.stringify({ hobby, level: s.level, plan: s.plan, progress: s.progress })); } catch(e){} },
  setLevel: (level) => { set({ level }); const s = { ...get() }; try { localStorage.setItem('hobmind_store', JSON.stringify({ hobby: s.hobby, level, plan: s.plan, progress: s.progress })); } catch(e){} },
  setPlan: (plan) => { set({ plan }); const s = { ...get() }; try { localStorage.setItem('hobmind_store', JSON.stringify({ hobby: s.hobby, level: s.level, plan, progress: s.progress })); } catch(e){} },
  setProgress: (progress) => { set({ progress }); const s = { ...get() }; try { localStorage.setItem('hobmind_store', JSON.stringify({ hobby: s.hobby, level: s.level, plan: s.plan, progress })); } catch(e){} }
}))
