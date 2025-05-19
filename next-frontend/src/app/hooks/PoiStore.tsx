import { create } from "zustand/react";
import {Marker} from "mapbox-gl"
export type PinTypes = 'hazard' | 'Poi' | 'breadCrumb'
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
    marker: Marker;
    type: PinTypes
}

export interface HazardPoi extends Poi {
    type: 'hazard';
    radius: number;
}

export interface BreadCrumb extends Poi {
    type: 'breadCrumb';
}

interface PoiStore {
    pois: Poi[];
    hazardPois: HazardPoi[];
    breadCrumbs: BreadCrumb[];
    selectedPoiId: string | null;
    addPoi: (poi: Poi) => void;
    addHazardPoi: (hazardPoi: HazardPoi) => void;
    selectPoi: (poiId: string | null) => void;
    updatePoi: (poiId: string, update: Partial<Poi>) => void;
    updateHazardPoi: (poiId: string, update: Partial<HazardPoi>) => void;
    updateTag: (poiId: string | null, category: string, subCategory: string, label: string) => void;
    clearTags: (poiId: string) => void;
    deletePoi: (poiId: string | null) => void;
    deleteHazardPoi: (poiId: string | null) => void;
    loadFromBackend: () => void
}

export const PoiStore = create<PoiStore>((set) => ({
    pois: [],
    hazardPois: [],
    breadCrumbs: [],
    selectedPoiId: null,
    loadFromBackend: async () => {
        const data = await fetch("/api/pois")
        const json = await data.json()

        const pois:Poi[] = json.filter((poi:Poi) => poi.type !== "breadCrumb" && poi.type !== 'hazard')
        const hazardPois:HazardPoi[] = json.pois.filter((poi:Poi) => poi.type === 'hazard')
        const breadCrumbs:BreadCrumb[] = json.pois.filter((poi:Poi) => poi.type === 'breadCrumb')
        set({pois:pois, hazardPois:hazardPois, breadCrumbs:breadCrumbs})
    },
    addPoi: (poi: Poi) => set((state) => ({
        pois: [...state.pois, poi],
        selectedPoiId: poi.id
    })),
    addHazardPoi: (hazardPoi: HazardPoi) => set((state) => ({
        hazardPois: [...state.hazardPois, hazardPoi],
        selectedPoiId: hazardPoi.id
    })),
    selectPoi: (poiId: string | null) => set(() => ({
        selectedPoiId: poiId
    })),
    updatePoi: (poiId, update) => set((state) => ({
        pois: state.pois.map((poi) =>
            poi.id === poiId ? { ...poi, ...update } : poi
        )
    })),
    updateHazardPoi: (poiId, update) => set((state) => ({
        hazardPois: state.hazardPois.map((hazardPoi) =>
            hazardPoi.id === poiId ? { ...hazardPoi, ...update } : hazardPoi
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
        })),
    deleteHazardPoi: (poiId: string | null) =>
        set((state) => ({
            hazardPois: state.hazardPois.filter(p => p.id !== poiId),
            selectedPoiId: state.selectedPoiId === poiId ? null : state.selectedPoiId
        })),
}));
