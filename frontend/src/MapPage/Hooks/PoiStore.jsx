import { create } from 'zustand'


// DOCS https://zustand.docs.pmnd.rs/getting-started/introduction

export const usePoiStore = create((set) => ({
    pois: [],
    addPoi: (poi) => set((state)=> ({pois:[...state.pois, poi]})),
    clearPois: ()=> set({pois:[]})
}))