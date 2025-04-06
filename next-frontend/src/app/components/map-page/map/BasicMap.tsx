"use client";

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, {Map, Marker, Popup} from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import PrimaryButton from "@/app/components/ui/ui-buttons/PrimaryButton";
import { PoiStore } from "@/app/hooks/PoiStore";
import { createRoot } from "react-dom/client";
import "../mapstyle.css";
import {nanoid} from "nanoid";

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoieHplcm84NjQiLCJhIjoiY2xmbW9wZ3BzMDQzaTN3cDUwcWplcGF6byJ9.PR0YiT3S05lotgY12AwWEQ';

//image map token
// mapboxgl.accessToken = 'pk.eyJ1IjoiZGtpbWgiLCJhIjoiY203dGU2djRzMXZxdzJrcHNnejd3OGVydSJ9.pIfFx8HCC58f_PzAUjALRQ';


type BasicMapProps = {
    roverCoords: {x: number, y: number};
    setControlPanelState: (state: "EvDetails" | "AddPin" | "SelectPin" |"SelectStation" | "AddTag") => void;
    selectedMarkerPopupRef: React.RefObject<mapboxgl.Popup | null>;
    selectedMarkerElementRef: React.RefObject<HTMLElement | null>;
}

const BasicMap = ({roverCoords, setControlPanelState, selectedMarkerPopupRef, selectedMarkerElementRef}: BasicMapProps) => {
    //TODO: Make this work with rover x,y coordinates, mock up the conversion for now
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<Map | null>(null);
    const [markers, setMarkers] = useState<Marker[]>([]);
    let [poiNum, setPoiNum] = useState(1);
    const { pois, addPoi, selectPoi, selectedPoiId, updatePoi } = PoiStore();
    const poiButtonActiveRef = useRef<boolean>(false);
    const [buttonActive, setButtonActive] = useState<boolean>(false);
    const setPoiButtonActive = (value: boolean) => {
        poiButtonActiveRef.current = value;
        setButtonActive(value)
    };
    const tempMarkerRef = useRef<Marker | null>(null);

    useEffect(() => {
        if (map.current) return;
        if (!mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/satellite-v9',

            //image map
            // style: 'mapbox://styles/dkimh/cm7teczs4006b01s0fnj9ezn8/draft',
            center: [-95.081213, 29.564795],
            zoom: 18.8,
        });

        // Listen for map clicks to add markers
        map.current.on('click', (e: mapboxgl.MapMouseEvent) => {
            if (tempMarkerRef.current){
                tempMarkerRef.current.remove();
            }

            //deselect all marker
            togglePoiSelection(false);

            // select marker
            const target = e.originalEvent.target;
            if (target instanceof Element) {
                const markerElement = target.closest('.mapboxgl-marker');
                if (markerElement instanceof HTMLElement) {
                    selectedMarkerElementRef.current = markerElement;
                    togglePoiSelection(true);
                    setControlPanelState("SelectPin");
                    return;
                }
            }

            //add temp marker
            const {lng, lat} = e.lngLat;
            addMarker(lng, lat);
        });
    }, []);

    const addMarker = (lng: number, lat: number) => {
        if (!map.current) return;

        // custom marker
        const markerElement = document.createElement("div");
        markerElement.className = 'w-2 h-2 sm:w-2 sm:h-2 md:w-3 md:h-3 lg:w-3 lg:h-3 xl:w-3 xl:h-3 bg-contain bg-no-repeat bg-center';
        markerElement.style.backgroundImage = 'url(/markers/marker.svg)';

        // popup container
        const popupContainer = document.createElement("div");

        // add marker
        const marker = new mapboxgl.Marker(markerElement)
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl
                .Popup({className: 'custom-popup', closeButton: false, offset: 6})
                .setDOMContent(popupContainer)
            )
            .addTo(map.current)
            .togglePopup();

        createRoot(popupContainer).render(
            <PrimaryButton active={buttonActive} logo={"/logo/poi-stroke.svg"} onClick={() => addPoiMarker(marker, lng, lat)}>
                +POI
            </PrimaryButton>
        );

        // Save marker to state
        tempMarkerRef.current = marker;
        setMarkers(prevMarkers => [...prevMarkers, marker]);
        setPoiButtonActive(false); // Reset POI button active state

        setControlPanelState("EvDetails");

        // Optional: Save marker to your POI store

    };

    // const clearAllMarkers = () => {
    //     // Remove all markers from the map
    //     markers.forEach((marker) => marker.remove());
    //     setMarkers([]); // Clear marker state
    //
    //     // Optional: Clear markers from your POI store
    //     clearPois();
    // };

    const addPoiMarker = (marker: Marker, lng: number, lat: number) => {
        if (!map.current) return;

        marker?.getPopup()?.remove();
        marker?.remove();

        const poiMarkerElement = document.createElement("div");
        poiMarkerElement.className = 'bg-no-repeat bg-contain bg-center sm:w-5m md:w-6 lg:w-7 sm:h-5 md:h-6 lg:h-7';
        poiMarkerElement.style.backgroundImage = 'url(/markers/selected-poi.svg)';

        const popupContainer = document.createElement("div");

        const popup = new mapboxgl.Popup({
            className: 'custom-final-popup',
            closeButton: false,
            offset: 16,
        }).setDOMContent(popupContainer).setHTML(`<div>POI ${poiNum}</div>`);



        new mapboxgl.Marker(poiMarkerElement)
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(map.current)
            .togglePopup();

        const id = nanoid();
        addPoi({
            id: id,
            name: `POI ${poiNum}`,
            coords: { lng, lat },
            tags: null,
        });
        selectPoi(id);

        selectedMarkerElementRef.current = poiMarkerElement;
        selectedMarkerPopupRef.current = popup;

        setPoiNum(poiNum++);
        setControlPanelState("AddPin");
    };


    const togglePoiSelection = (selected: Boolean) => {
        if (selectedMarkerElementRef.current) {
            const element = selectedMarkerElementRef.current;
            if (selected) {
                element.style.backgroundImage = 'url(/markers/selected-poi.svg)';
            } else {
                element.style.backgroundImage = 'url(/markers/default-poi.svg)';
            }
        }
    }

    return (
        <div className="map-wrapper">
            {/* Column labels */}
            <div className="column-labels">
                {Array.from({ length: 28 }, (_, i) => (
                    <div key={i} className="label-col">{i}</div>
                ))}
            </div>

            {/* Row labels */}
            <div className="row-labels">
                {Array.from({ length: 26 }, (_, i) => (
                    <div key={i} className="label-row">{String.fromCharCode(90 - i)}</div>
                ))}
            </div>

            {/* Map + grid overlay */}
            <div className="map-container">
                <div ref={mapContainer} className="mapbox-container" />
                <div className="map-grid-overlay pointer-events-none" />
            </div>
        </div>
    );
};

export default BasicMap;