import { create } from 'zustand'


// DOCS https://zustand.docs.pmnd.rs/getting-started/introduction

const useBearStore = create((set) => ({
    bears: 0,
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 }),
}))