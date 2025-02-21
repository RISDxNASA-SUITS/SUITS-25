import { create } from 'zustand'

interface Poi {
  lng: number;
  lat: number;
}

interface PoiStore {
  pois: Poi[];
  addPoi: (poi: Poi) => void;
  clearPois: () => void;
}

// DOCS https://zustand.docs.pmnd.rs/getting-started/introduction

export const usePoiStore = create<PoiStore>((set) => ({
    pois: [],
    addPoi: (poi: Poi) => set((state: PoiStore) => ({pois:[...state.pois, poi]})),
    clearPois: () => set({pois:[]})
}))