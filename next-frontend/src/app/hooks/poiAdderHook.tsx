import { create } from "zustand";


interface PoiAdditionState {
    poiLat: number | undefined,
    poiLon : number | undefined,
    poiType : string | undefined,
    getPoiLat : () => number | undefined;
    getPoiLon : () => number | undefined;
    getPoiType : () => string | undefined;
    setPoiLat: (x: number) => void;
    setPoiLon: (x: number) => void;
    setPoiType: (x: string) => void;
    
}

export const usePoiAdderHook = create<PoiAdditionState>((set, get) => ({
    poiLat : undefined,
    poiLon : undefined,
    poiType : undefined,
    getPoiLat : () => get().poiLat,
    getPoiLon : () => get().poiLon,
    getPoiType : () => get().poiType,
    setPoiLat : (x : number) => {set((state) => ({...state , poiLat : x}))},
    setPoiLon : (x : number) => {set((state) => ({...state , poiLon : x}))},
    setPoiType : (x : string) => {set((state) => ({...state , poiType : x}))}

}))

