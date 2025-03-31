import {create} from "zustand/react";

export interface Poi {
    id: string;
    name: string;
    coords: {lng: number, lat: number};
    tags: string[];
    voiceMemo?: string[];
}

interface PoiStore {
    pois: Poi[];
    selectedPoiId: string | null;

    addPoi: (poi: Poi) => void;
    selectPoi: (poiId: string | null) => void;
    updatePoi: (poiId: string, update: Partial<Poi>) => void;

}

export const PoiStore = create<PoiStore>((set) => ({
    pois: [],
    selectedPoiId: null,

    addPoi: (poi: Poi) => set((state) => ({
        pois: [...state.pois, poi],
        selectedPoi: poi.id
    })),

    selectPoi: (poiId: string | null) => set((state) => ({
        selectedPoiId: poiId,
    })),

    updatePoi: (poiId, update) => set((state) => ({
        pois: state.pois.map((poi) =>
            poi.id === poiId ? {...poi, ...update} : poi
        ),
    }))
}))