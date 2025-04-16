"use client";

import React, {useRef, useEffect, useState, RefObject} from 'react';
import mapboxgl, {Marker, Popup} from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import PrimaryButton from "@/app/components/ui/ui-buttons/PrimaryButton";
import { PoiStore } from "@/app/hooks/PoiStore";
import { createRoot } from "react-dom/client";
import "../mapstyle.css";
import {nanoid} from "nanoid";
import AddButton from '../../ui/ui-buttons/AddButton';
import SmallerButton from "@/app/components/ui/ui-buttons/SmallerButton"
import SquareButton from '../../ui/ui-buttons/SquareButton';
import closeButton from "@/app/components/ui/ui-buttons/CloseButton";
import {SelectedMarkerRefs} from "@/app/components/map-page/SelectedMarkerRefs";

// Set your Mapbox access token
// mapboxgl.accessToken = 'pk.eyJ1IjoieHplcm84NjQiLCJhIjoiY2xmbW9wZ3BzMDQzaTN3cDUwcWplcGF6byJ9.PR0YiT3S05lotgY12AwWEQ';

//Mapbox token draft
mapboxgl.accessToken = 'pk.eyJ1IjoiZGtpbWgiLCJhIjoiY203dGU2djRzMXZxdzJrcHNnejd3OGVydSJ9.pIfFx8HCC58f_PzAUjALRQ';

//Mapbox token publish
// mapboxgl.accessToken = 'pk.eyJ1IjoiZGtpbWgiLCJhIjoiY203dGU2djRzMXZxdzJrcHNnejd3OGVydSJ9.pIfFx8HCC58f_PzAUjALRQ';

type BasicMapProps = {
    roverCoords: {x: number, y: number};
    setControlPanelState: (state: "EvDetails" | "AddPin" | "SelectPin" |"SelectStation" | "AddTag") => void;
    selectedMarkerRef: RefObject<SelectedMarkerRefs>;
}

const BasicMap = ({roverCoords, setControlPanelState, selectedMarkerRef}: BasicMapProps) => {
    //TODO: Make this work with rover x,y coordinates, mock up the conversion for now
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
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
    const markerMap = new Map<HTMLElement, { id: string, marker: Marker }>();

    //toggle the expanded add menu
    const [addActive, toggleAddActive] = useState<boolean>(false);

    useEffect(() => {
        if (map.current) return;
        if (!mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            //map style draft
            style: 'mapbox://styles/dkimh/cm9k7yru7008601s617bl7zmh/draft',

            //map style publish
            // style: 'mapbox://styles/dkimh/cm9k7yru7008601s617bl7zmh',
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
                    selectedMarkerRef.current.markerElement = markerElement;
                    togglePoiSelection(true);
                    setControlPanelState("SelectPin");

                    // find HTMLElement and update selected POI id
                    const match = markerMap.get(markerElement);
                    if (match) {
                        selectPoi(match.id);
                    }
                    return;
                }
            }

            //add temp marker
            const {lng, lat} = e.lngLat;
            addMarker(lng, lat);

        });

    }, [poiButtonActiveRef.current]);

    const addMarker = (lng: number, lat: number) => {
        if (!map.current) return;

        // custom marker
        const markerElement = document.createElement("div");
        markerElement.className = 'w-2 h-2 sm:w-2 sm:h-2 md:w-3 md:h-3 lg:w-3 lg:h-3 xl:w-3 xl:h-3 bg-contain bg-no-repeat bg-center';
        markerElement.style.backgroundImage = 'url(/markers/marker.svg)';

        // popup container
        const popupContainer = document.createElement("div");

        const popup = new mapboxgl.Popup({ offset: 12, closeButton: false })
            .setDOMContent(popupContainer);

        const marker = new mapboxgl.Marker(markerElement)
            .setLngLat([lng, lat])
            .setPopup(popup)
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
        setPoiButtonActive(false);

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

        //hashmap referring marker element
        markerMap.set(poiMarkerElement, { id, marker });
        addPoi({
            id: id,
            name: `POI ${poiNum}`,
            coords: { lng, lat },
            tags: null,
        });
        selectPoi(id);

        selectedMarkerRef.current.markerElement = poiMarkerElement;
        selectedMarkerRef.current.popup = popup;

        setPoiNum(poiNum++);
        setControlPanelState("AddPin");
    };


    const togglePoiSelection = (selected: Boolean) => {
        if (selectedMarkerRef.current.markerElement) {
            const element = selectedMarkerRef.current.markerElement;
            if (selected) {
                element.style.backgroundImage = 'url(/markers/selected-poi.svg)';
            } else {
                element.style.backgroundImage = 'url(/markers/default-poi.svg)';
            }
        }
    };

    //toggles add menu popup
    const onAddClick = () => {
        toggleAddActive(!addActive);

        if (poiButtonActiveRef.current) {
            setPoiButtonActive(false);

            //get rid of any temp marker when the menu closes
            if (tempMarkerRef.current){
                tempMarkerRef.current.remove();
            }
        }
    };

    //add poi button click logic
    const onPoiButtonClick = () => {

        //get rid of any temp marker when toggled off
        if (poiButtonActiveRef.current) {
            if (tempMarkerRef.current){
                tempMarkerRef.current.remove();
            }

            //remove the popup also
            toggleAddActive(false);
        }

        //toggle when clicked
        setPoiButtonActive(!poiButtonActiveRef.current);
    };

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

                {/* Add Marker Menu */}
                <div className="absolute bottom-8 right-4 flex flex-col gap-2 items-end">
                    {/* Draw Hazard */}
                    <PrimaryButton 
                        logo={"/logo/edit-white.svg"}
                        logoClassName={"w-8 h-8"}/>

                    {/* expandable button container*/}
                    <div className="flex flex-row-reverse justify-center items-center text-nowrap
                    border border-light-purple bg-galaxy-purple rounded-xl transition-all duration-150">
                        {/* expandable button*/}
                        <PrimaryButton
                            logo={`${addActive ? `/logo/minus.svg` : `logo/add-white.svg`}`}
                            logoClassName={"w-8 h-8"}
                            className={"p-4 hover:bg-another-purple rounded-xl"}
                            onClick={onAddClick}/>

                        {/* popup section - add POI & add Hazard*/}
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden
                            ${addActive ? `opacity-100 mx-4`: `opacity-0 w-0 pointer-events-none ml-0`} flex justify-center items-center gap-4`}>
                            <PrimaryButton>
                                <img src="/logo/hazard.svg" alt={"add-hazard"}/>
                                Add Hazard
                            </PrimaryButton>

                            <PrimaryButton active={buttonActive} onClick={onPoiButtonClick}>
                                <img src="/logo/poi-stroke.svg" alt={"add-poi"}/>
                                Add POI
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasicMap;