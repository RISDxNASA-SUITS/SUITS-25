import { create } from "zustand/react";

type TagSelections = {
    [category: string]: {
        [subCategory: string]: string[];
    };
};

type VoiceNotes = {
    id: number;
    audioUrl: string | null;
    time: string;
    date: string;
    name: string;
}

export interface Poi {
    id: string;
    name: string;
    coords: { lng: number; lat: number };
    tags: TagSelections | null;
    voiceMemo?: string[];

    voiceNoteID?: number[];

    voiceNotes?: VoiceNotes[];
}

interface PoiStore {
    pois: Poi[];
    selectedPoiId: string | null;

    addPoi: (poi: Poi) => void;
    selectPoi: (poiId: string | null) => void;
    updatePoi: (poiId: string, update: Partial<Poi>) => void;
    updateTag: (poiId: string | null, category: string, subCategory: string, label: string) => void;
    clearTags: (poiId: string) => void;
    deletePoi: (poiId: string | null) => void;
}

export const PoiStore = create<PoiStore>((set) => ({
    pois: [],
    selectedPoiId: null,

    addPoi: (poi: Poi) => set((state) => ({
        pois: [...state.pois, poi],
        selectedPoiId: poi.id
    })),

    selectPoi: (poiId: string | null) => set(() => ({
        selectedPoiId: poiId
    })),

    updatePoi: (poiId, update) => set((state) => ({
        pois: state.pois.map((poi) =>
            poi.id === poiId ? { ...poi, ...update } : poi
        )
    })),

    updateTag: (poiId, category, subCategory, label) =>
        set((state) => {
            const poi = state.pois.find(p => p.id === poiId);
            if (!poi) return {};

            const current = poi.tags?.[category]?.[subCategory] || [];
            const isSelected = current.includes(label);
            const updated = isSelected
                ? current.filter(l => l !== label) // Remove label
                : [...current, label]; // Add label

            const updatedTags: TagSelections = {
                ...poi.tags,
                [category]: {
                    ...poi.tags?.[category],
                    [subCategory]: updated
                }
            };

            const updatedPois = state.pois.map(p =>
                p.id === poiId ? { ...p, tags: updatedTags } : p
            );

            return { pois: updatedPois };
        }),

    clearTags: (poiId: string) =>
        set((state) => ({
            pois: state.pois.map(p =>
                p.id === poiId ? { ...p, tags: {} } : p
            )
        })),

    deletePoi: (poiId: string | null) =>
        set((state) => ({
            pois: state.pois.filter(p => p.id !== poiId),
            selectedPoiId: state.selectedPoiId === poiId ? null : state.selectedPoiId
        }))
}));
