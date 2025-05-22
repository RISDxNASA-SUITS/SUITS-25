import { create } from "zustand/react";
import {Marker} from "mapbox-gl"
import { convertMoonToEarth } from "../components/map-page/map/BasicMap";
import { nanoid } from "nanoid";
export type PinTypes = 'hazard' | 'Poi' | 'breadCrumb' | 'ltv';

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
    id?: number | null 
    name: string;
    coords: { lng: number; lat: number };
    moonCoords: { x: number; y: number };
    tags: String[];
    type: PinTypes;
    audioId: number | null;
    description?: string;
    radius?: number | null;
}

export interface HazardPoi extends Poi {
    type: 'hazard';
    radius: number;
}

export interface Ltv extends Poi {
    type: 'ltv';
}

export interface BreadCrumb extends Poi {
    type: 'breadCrumb';
}



type poiBackend = {
    id?: number | null ;
    name: string;
    x: number;
    y: number;
    tags: String[];
    description: string;
    type: string;
    audioId: number | null;
    radius: number | null;
}

interface PoiStore {
    pois: Poi[];
    hazardPois: HazardPoi[];
    breadCrumbs: BreadCrumb[];
    ltvPois: Ltv[];
    selectedPoiId: number | null;
    addPoi: (poi: Poi) => void;
    addHazardPoi: (hazardPoi: HazardPoi) => void;
    addLtvPoi: (ltvPoi: Ltv) => void;
    selectPoi: (poiId: number | null) => void;
    updateTag: (poiId: string | null, category: string, subCategory: string, label: string) => void;
  
    deletePoi: (poiId: string | null) => void;
    loadFromBackend: () => void
    updatePoi: (poi: Poi) => void
    addVoiceNote: (poiId:number, voiceNote:Number) => void
}


const backendToFrontendPoi = (poi: poiBackend): Poi => {
    let parsedTags: TagSelections | null = null;



    return {
        id: poi.id,
        name: poi.name,
        coords: convertMoonToEarth({x: poi.x, y: poi.y}),
        moonCoords: { x: poi.x, y: poi.y },
        tags: poi.tags,
        type: poi.type as PinTypes,
        audioId: poi.audioId,
        description: poi.description,
        radius: poi.radius
    }
}

const frontendToBackendPoi = (poi: Poi): poiBackend => {
    return {
        id:poi.id,
        name: poi.name,
        x: poi.moonCoords.x,
        y: poi.moonCoords.y,
        tags: poi.tags,
        type: poi.type,
        audioId: poi.audioId,
        description: poi.description || "",
        radius: poi.radius
    }
}

export const PoiStore = create<PoiStore>((set,get) => ({
    pois: [],
    hazardPois: [],
    ltvPois: [],
    breadCrumbs: [],
    selectedPoiId: null,
    loadFromBackend: async () => {
        const data = await fetch('/api/pois')
        let json = await data.json()
        json = json.data.map((poi: poiBackend) => backendToFrontendPoi(poi))
        const pois:Poi[] = json.filter((poi:Poi) => poi.type !== "breadCrumb" && poi.type !== 'hazard')
        const hazardPois:HazardPoi[] = json.filter((poi:Poi) => poi.type === 'hazard')
        const breadCrumbs:BreadCrumb[] = json.filter((poi:Poi) => poi.type === 'breadCrumb')
        const ltvPois: Ltv[] = json.filter((poi: Poi) => poi.type === 'ltv');
        set({pois:pois, hazardPois:hazardPois, breadCrumbs:breadCrumbs, ltvPois:ltvPois});
    },
    updatePoi: async (poi: Poi) => {
        const backendPoi = frontendToBackendPoi(poi)
        await fetch('/api/pois', {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(backendPoi)
        })
        get().loadFromBackend()
    },
    addPoi: async (poi: Poi) => {
        const backendPoi = frontendToBackendPoi(poi)
        console.log(get().pois, "is the pois");

        const data = await fetch('/api/pois', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(backendPoi)
        })
        let json = await data.json()
        console.log(json, "is the json");
        const id = json.id
        console.log(id, "is the id");

        get().loadFromBackend()
        set({selectedPoiId: id})
    },
    addHazardPoi: async (hazardPoi: HazardPoi) => {
        const data = await fetch('/api/pois', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(frontendToBackendPoi(hazardPoi))
        })
        let json = await data.json()
        console.log(json, "is the json");
        const id = json.id
        console.log(id, "is the id");
        console.log(get().pois, "is the pois");
        get().loadFromBackend()
        set({selectedPoiId: id})
    },
    addLtvPoi: async (ltvPoi: Ltv) => {
        const data = await fetch('/api/pois', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(frontendToBackendPoi(ltvPoi))
        })
        let json = await data.json()
        console.log(json, "is the json");
        const id = json.id
        console.log(id, "is the id");
        get().loadFromBackend()
    },
    selectPoi: (poiId: number | null) => set(() => ({
        selectedPoiId: poiId
    })),
    addVoiceNote: async (poiId:number, voiceNote:Number) => {
        await fetch('/api/pois/voice-note', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({poiId, voiceNote})
        })
        get().loadFromBackend()
    },

    updateTag: async (poiId, label) =>{
        console.log("CALLED WITH ID ", poiId)
        const poi = get().pois.find(p => p.id === poiId)
        const hzrd = get().hazardPois.find(p => p.id === poiId)
        const target = poi ?? hzrd
        let tags = target.tags
        console.log("hazard", hzrd, "pOI", poi)

        if (target.tags.includes(label)) {
            target.tags = target.tags.filter(tag => tag !== label)
        } else {
            target.tags.push(label)
        }



        await fetch(`/api/pois/updateTags/${poiId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({tags: target?.tags})
        })
        get().loadFromBackend()
    },
    deletePoi: async (poiId: string | null) => {
        if (!poiId) return;
        await fetch(`/api/pois/${poiId}`, {
            method: "DELETE",
        })
        get().loadFromBackend()
    }


}));










