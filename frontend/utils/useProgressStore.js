import create from 'zustand'

export const useProgressStore = create((set) => ({
  progress: {},
  setProgress: (hobby, techniqueId, status) => set((state) => {
    const copy = { ...state.progress };
    copy[hobby] = copy[hobby] || {};
    copy[hobby][techniqueId] = status;
    return { progress: copy };
  })
}));
