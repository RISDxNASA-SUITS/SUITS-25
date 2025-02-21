"use client";

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map, Marker } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapButton from "./MapButton";
import { usePoiStore } from "../../../hooks/PoiStore";

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoieHplcm84NjQiLCJhIjoiY2xmbW9wZ3BzMDQzaTN3cDUwcWplcGF6byJ9.PR0YiT3S05lotgY12AwWEQ';

const BasicMap = ({roverCoords}: {roverCoords: {x: number, y: number}}) => {
    //TODO: Make this work with rover x,y coordinates, mock up the conversion for now
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<Map | null>(null);
    const [markers, setMarkers] = useState<Marker[]>([]);
    const { pois, addPoi, clearPois } = usePoiStore();
    const poiButtonActiveRef = useRef<boolean>(false);
    const [buttonActive, setButtonActive] = useState<boolean>(false);
    const setPoiButtonActive = (value: boolean) => {
        poiButtonActiveRef.current = value;
        setButtonActive(value)
    };

    useEffect(() => {
        if (map.current) return;
        if (!mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-0.09, 51.505],
            zoom: 13,
        });
        
        // Listen for map clicks to add markers
        map.current.on('click', (e: mapboxgl.MapMouseEvent) => {
            if (!poiButtonActiveRef.current) return;
            const { lng, lat } = e.lngLat;
            addMarker(lng, lat);
        });
    }, []);

    const addMarker = (lng: number, lat: number) => {
        if (!map.current) return;

        // Create a new marker
        const marker = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup().setHTML(`<b>Marker</b><br>(${lng.toFixed(4)}, ${lat.toFixed(4)})`)) // Optional popup
            .addTo(map.current);

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

    // TODO Make it look like the figma :) its not even close

    return (
        <div className="w-screen h-screen bg-slate-800 flex justify-center items-center">
            <div className="h-3/4 w-3/4 bg-slate-700 flex flex-row gap-2">
                <div className="h-full w-1/5 bg-slate-600 flex flex-col gap-2 p-4 justify-center items-center">
                    <MapButton active={buttonActive} onClick={() => setPoiButtonActive(true)}>Add POI</MapButton>
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
