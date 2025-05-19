import { create } from "zustand/react";
import {Marker} from "mapbox-gl"
import { convertMoonToEarth } from "../components/map-page/map/BasicMap";
import { nanoid } from "nanoid";
export type PinTypes = 'hazard' | 'Poi' | 'breadCrumb'

type TagSelections = {
    [category: string]: {
        [subCategory: string]: string[];
    };
};

const categories = {
    Rock: {
    Color: ["Black", "Gray", "Light-toned"],
    Diameter: ["5cm", "10cm", "15cm"],
    Depth: ["0.1kg", "0.2kg", "0.3kg"],
    Roughness: ["Fine", "Medium", "Coarse"],
},
Terrain: {
    Slope: ["flat", "steep"],
    Texture: ["grainy", "smooth", "rocky"],
},
Category: {
    Type: ["sedimentary", "igneous", "metamorphic"],
},
}

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
    moonCoords: { x: number; y: number };
    tags: TagSelections | null;
    // voiceMemo?: string[];

    // voiceNoteID?: number[];

    // voiceNotes?: VoiceNotes[];
   
    type: PinTypes
    audio_id: number | null;
    description?: string;
}

export interface HazardPoi extends Poi {
    type: 'hazard';
    radius: number;
}

export interface BreadCrumb extends Poi {
    type: 'breadCrumb';
}

type poiBackend = {
    id: string;
    name: string;
    x: number;
    y: number;
    tags: string;
    description: string;
    type: string;
    audio_id: number | null;
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

const backendToFrontendPoi = (poi: poiBackend): Poi => {
    let parsedTags: TagSelections | null = null;
    
    if (poi.tags) {
        const tagArray = poi.tags
        parsedTags = {};
        
        // Iterate through each category
        Object.entries(categories).forEach(([category, subCategories]) => {
            const categoryTags: { [key: string]: string[] } = {};
            
            // Iterate through each subcategory
            Object.entries(subCategories).forEach(([subCategory, values]) => {
                // Filter values that exist in the tag array
                const matchingValues = values.filter(value => 
                    tagArray.includes(value)
                );
                
                // Only add the subcategory if it has matching values
                if (matchingValues.length > 0) {
                    categoryTags[subCategory] = matchingValues;
                }
            });
            
            // Only add the category if it has any subcategories with values
            if (Object.keys(categoryTags).length > 0) {
                parsedTags[category] = categoryTags;
            }
        });
        
        // If no tags were matched, set to null
        if (Object.keys(parsedTags).length === 0) {
            parsedTags = null;
        }
    }

    return {
        id: nanoid(),
        name: poi.name,
        coords: convertMoonToEarth({x: poi.x, y: poi.y}),
        moonCoords: { x: poi.x, y: poi.y },
        tags: parsedTags,
        type: poi.type as PinTypes,
        audio_id: poi.audio_id,
        description: poi.description
    }
}

const frontendToBackendPoi = (poi: Poi): poiBackend => {
    return {
        id: poi.id,
        name: poi.name,
        x: poi.moonCoords.x,
        y: poi.moonCoords.y,
        tags: poi.tags ? JSON.stringify(poi.tags) : "",
        type: poi.type,
        audio_id: poi.audio_id,
        description: poi.description || ""
    }
}

export const PoiStore = create<PoiStore>((set) => ({
    pois: [],
    hazardPois: [],
    breadCrumbs: [],
    selectedPoiId: null,
    loadFromBackend: async () => {
        const data = await fetch("/api/pois")
        let json = await data.json()
        json = json.map((poi: poiBackend) => backendToFrontendPoi(poi))
        const pois:Poi[] = json.filter((poi:Poi) => poi.type !== "breadCrumb" && poi.type !== 'hazard')
        const hazardPois:HazardPoi[] = json.filter((poi:Poi) => poi.type === 'hazard')
        const breadCrumbs:BreadCrumb[] = json.filter((poi:Poi) => poi.type === 'breadCrumb')
        set({pois:pois, hazardPois:hazardPois, breadCrumbs:breadCrumbs})
    },
    addPoi: async (poi: Poi) => {
        const backendPoi = frontendToBackendPoi(poi)
        const data = await fetch("/api/pois", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(backendPoi)
        })
        set((state) => ({
            pois: [...state.pois, poi],
            selectedPoiId: poi.id
        }))
    },
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
