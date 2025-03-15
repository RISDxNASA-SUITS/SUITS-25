"use client";

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map, Marker } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapButton from "./MapButton";
import { usePoiStore } from "@/app/hooks/PoiStore";
import { createRoot } from "react-dom/client";
import "./mapstyle.css";

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoieHplcm84NjQiLCJhIjoiY2xmbW9wZ3BzMDQzaTN3cDUwcWplcGF6byJ9.PR0YiT3S05lotgY12AwWEQ';

const BasicMap = ({roverCoords}: {roverCoords: {x: number, y: number}}) => {
    //TODO: Make this work with rover x,y coordinates, mock up the conversion for now
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<Map | null>(null);
    const [markers, setMarkers] = useState<Marker[]>([]);
    let [poiNum, setPoiNum] = useState(1);
    const { pois, addPoi, clearPois } = usePoiStore();
    const poiButtonActiveRef = useRef<boolean>(false);
    const [buttonActive, setButtonActive] = useState<boolean>(false);
    const setPoiButtonActive = (value: boolean) => {
        poiButtonActiveRef.current = value;
        setButtonActive(value)
    };
    const finalizePoiRef = useRef<boolean>(false);
    const selectedMarkerRef = useRef<Marker | null>(null);

    useEffect(() => {
        if (map.current) return;
        if (!mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [-95.081213, 29.564795],
            zoom: 18.7,
        });

        // Listen for map clicks to add markers
        map.current.on('click', (e: mapboxgl.MapMouseEvent) => {
            // select marker
            const target = e.originalEvent.target;
            if (target instanceof Element) {
                const markerElement = target.closest('.mapboxgl-marker');
                if (markerElement) {
                    // setSelectedMarker(markerElement);
                    togglePoiSelection(true);
                    return;
                }
            }

            if (finalizePoiRef.current) {
                togglePoiSelection(false);
                finalizePoiRef.current = false;
            } else {
                const {lng, lat} = e.lngLat;
                addMarker(lng, lat);
            }
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
            <MapButton active={buttonActive} logo={"/logo/poiLogo.svg"} onClick={() => addPoiMarker(marker, lng, lat)}>
                +POI
            </MapButton>
        );

        // Save marker to state
        setMarkers(prevMarkers => [...prevMarkers, marker]);
        setPoiButtonActive(false); // Reset POI button active state

        // Optional: Save marker to your POI store
        addPoi({ lng, lat });
    };

    const clearAllMarkers = () => {
        // Remove all markers from the map
        markers.forEach((marker) => marker.remove());
        setMarkers([]); // Clear marker state

        // Optional: Clear markers from your POI store
        clearPois();
    };

    const addPoiMarker = (marker: Marker, lng: number, lat: number) => {
        if (!map.current) return;

        marker?.getPopup()?.remove();
        marker?.remove();

        const poiMarkerElement = document.createElement("div");
        poiMarkerElement.className = 'bg-no-repeat bg-contain bg-center sm:w-5m md:w-6 lg:w-7 sm:h-5 md:h-6 lg:h-7';
        poiMarkerElement.style.backgroundImage = 'url(/markers/selectedPoi.svg)';

        const popupContainer = document.createElement("div");
        popupContainer.innerHTML = `<div>POI ${poiNum}</div>`;

        const poiMarker = new mapboxgl.Marker(poiMarkerElement)
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup({className: 'custom-final-popup', closeButton: false, offset: 16}).setDOMContent(popupContainer))
            .addTo(map.current)
            .togglePopup();

        finalizePoiRef.current = true;
        selectedMarkerRef.current = poiMarker;
        setPoiNum(poiNum++);
    }

    const togglePoiSelection = (selected: Boolean) => {
        if (selectedMarkerRef.current) {
            const element = selectedMarkerRef.current.getElement();
            // element.className = 'bg-no-repeat bg-contain bg-center sm:w-5m md:w-6 lg:w-7 sm:h-5 md:h-6 lg:h-7';
            if (selected) {
                element.style.backgroundImage = 'url(/markers/selectedPoi.svg)';
            } else {
                element.style.backgroundImage = 'url(/markers/defaultPoi.svg)';
            }
        }
    }

    // TODO Make it look like the figma :) its not even close

    return (
        <div className="w-screen h-screen bg-slate-800 flex justify-center items-center">
            <div className="h-full w-full bg-white bg-opacity-10 flex flex-row gap-1">
                <div className="h-full w-1/4 bg-midnight-purple flex flex-col gap-2 p-4 justify-center items-center">
                    <MapButton active={false} onClick={clearAllMarkers}>Clear All Markers</MapButton>
                </div>
                <div className="w-4/5">
                    <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
                </div>
            </div>
        </div>
    );
};

export default BasicMap;
