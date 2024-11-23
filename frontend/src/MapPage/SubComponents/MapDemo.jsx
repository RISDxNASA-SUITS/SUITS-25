import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapButton from "./MapButton.jsx";
import { usePoiStore } from "../Hooks/PoiStore.jsx";

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoieHplcm84NjQiLCJhIjoiY2xmbW9wZ3BzMDQzaTN3cDUwcWplcGF6byJ9.PR0YiT3S05lotgY12AwWEQ';

const BasicMap = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [markers, setMarkers] = useState([]); // State to track added markers
    const { pois, addPoi, clearPoi } = usePoiStore();
    const poiButtonActiveRef = useRef(false); // Ref to track POI button active state
    const [buttonActive, setButtonActive] = useState(false);
    const setPoiButtonActive = (value) => {
        poiButtonActiveRef.current = value; // Update ref value
        setButtonActive(value)
    };

    useEffect(() => {
        if (map.current) return;
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-0.09, 51.505],
            zoom: 13,
        });

        // Listen for map clicks to add markers
        map.current.on('click', (e) => {
            if (!poiButtonActiveRef.current) return;
            const { lng, lat } = e.lngLat; // Get the longitude and latitude
            addMarker(lng, lat);
        });
    }, []);

    const addMarker = (lng, lat) => {
        // Create a new marker
        const marker = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup().setHTML(`<b>Marker</b><br>(${lng.toFixed(4)}, ${lat.toFixed(4)})`)) // Optional popup
            .addTo(map.current);

        // Save marker to state
        setMarkers((prevMarkers) => [...prevMarkers, marker]);
        setPoiButtonActive(false); // Reset POI button active state

        // Optional: Save marker to your POI store
        addPoi({ lng, lat });
    };

    const clearAllMarkers = () => {
        // Remove all markers from the map
        markers.forEach((marker) => marker.remove());
        setMarkers([]); // Clear marker state

        // Optional: Clear markers from your POI store
        clearPoi();
    };

    return (
        <div className="w-screen h-screen bg-slate-800 flex justify-center items-center">
            <div className="h-3/4 w-3/4 bg-slate-700 flex flex-row gap-2">
                <div className="h-full w-1/5 bg-slate-600 flex flex-col gap-2 p-4 justify-center items-center">
                    <MapButton active={buttonActive} onClick={() => setPoiButtonActive(true)}>Add POI</MapButton>
                    <MapButton onClick={clearAllMarkers}>Clear All Markers</MapButton>
                </div>
                <div className="w-4/5">
                    <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
                </div>
            </div>
        </div>
    );
};

export default BasicMap;
