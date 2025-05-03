import {RefObject} from "react";

export type SelectedMarkerRefs = {
    popup: mapboxgl.Popup | null;
    markerElement: HTMLElement | null;
};


export const clearSelectedMarker = (selectedMarkerRef: RefObject<SelectedMarkerRefs>) => {
    if (selectedMarkerRef.current) {
        selectedMarkerRef.current.markerElement?.remove();
        selectedMarkerRef.current.popup?.remove();
        selectedMarkerRef.current.markerElement = null;
        selectedMarkerRef.current.popup = null;
    }
};
