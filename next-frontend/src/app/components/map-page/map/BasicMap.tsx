"use client";

import React, {useRef, useEffect, useState, RefObject} from 'react';
import mapboxgl, {Marker, Popup} from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import PrimaryButton from "@/app/components/ui/ui-buttons/PrimaryButton";
import { PoiStore } from "@/app/hooks/PoiStore";
import { createRoot } from "react-dom/client";
import "../mapstyle.css";
import {nanoid} from "nanoid";
import TertiaryButton from "@/app/components/ui/ui-buttons/TertiaryButton";
import { Tooltip } from '../../ui/ui-buttons/Tooltip';
import {PinTypes} from "@/app/hooks/PoiStore";


// Set your Mapbox access token
// mapboxgl.accessToken = 'pk.eyJ1IjoieHplcm84NjQiLCJhIjoiY2xmbW9wZ3BzMDQzaTN3cDUwcWplcGF6byJ9.PR0YiT3S05lotgY12AwWEQ';

//Mapbox token draft
mapboxgl.accessToken = 'pk.eyJ1IjoiZGtpbWgiLCJhIjoiY203dGU2djRzMXZxdzJrcHNnejd3OGVydSJ9.pIfFx8HCC58f_PzAUjALRQ';

//Mapbox token publish
// mapboxgl.accessToken = 'pk.eyJ1IjoiZGtpbWgiLCJhIjoiY203dGU2djRzMXZxdzJrcHNnejd3OGVydSJ9.pIfFx8HCC58f_PzAUjALRQ';

type BasicMapProps = {
    roverCoords: {x: number, y: number};
    setControlPanelState: (state: "EvDetails" | "AddPin" | "SelectPin" | "AddTag") => void;
    selectedMarkerRef: RefObject<mapboxgl.Marker | null>;
}

const BasicMap = ({roverCoords, setControlPanelState, selectedMarkerRef}: BasicMapProps) => {
    //TODO: Make this work with rover x,y coordinates, mock up the conversion for now
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [markers, setMarkers] = useState<Marker[]>([]);
    let [poiNum, setPoiNum] = useState(1);
    const { pois, addPoi, selectPoi, selectedPoiId, updatePoi, loadFromBackend } = PoiStore();
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
                    const match = markerMap.get(markerElement);
                    if (match) {
                        selectedMarkerRef.current = match.marker;
                        togglePoiSelection(true);
                        setControlPanelState("SelectPin");
                        selectPoi(match.id);
                        return;
                    }
                }
            }

            //add temp marker
            const {lng, lat} = e.lngLat;
            addMarker(lng, lat);

        });

    }, [poiButtonActiveRef.current]);


    useEffect(()=> {


        loadFromBackend()

    },[])
    useEffect(()=> {
        pois.forEach(x => x.addMarkerFromBackend())
    }, [pois])

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
            <>
                <PrimaryButton active={buttonActive} logo={"/logo/poi-stroke.svg"} onClick={() => addPoiMarker(marker, lng, lat)}>
                    +POI
                </PrimaryButton>
                <PrimaryButton active={buttonActive} logo={"/logo/poi-stroke.svg"} onClick={() => addHazardMarker(marker, lng, lat)}>
                    +Hazard
                </PrimaryButton>
            </>
        );

        // Save marker to state
        tempMarkerRef.current = marker;
        // setMarkers(prevMarkers => [...prevMarkers, marker]);
        setPoiButtonActive(false);

        setControlPanelState("EvDetails");
    };
    const addMarkerFromBackend = (lng: number, lat: number, type: PinTypes) => {
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

        if(type === "hazard"){
            addHazardMarker(marker,lng,lat);
        }else {
            addPoiMarker(marker,lng,lat);
        }



    };


    // const clearAllMarkers = () => {
    //     // Remove all markers from the map
    //     markers.forEach((marker) => marker.remove());
    //     setMarkers([]); // Clear marker state
    //
    //     // Optional: Clear markers from your POI store
    //     clearPois();
    // };


    const addMarkerNoDom(marker : Marker, lng:number, lat:number, type:PinTypes){
        const id = nanoid();
        addPoi({
            id,
            name: `POI ${poiNum}`,
            coords: { lng, lat },
            tags: null,
            marker,
        });
    }


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


        const poiMarker = new mapboxgl.Marker(poiMarkerElement)
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(map.current)
            .togglePopup();



        //hashmap referring marker element
        markerMap.set(poiMarkerElement, { id, marker: poiMarker });
        // addPoi({
        //     id: id,
        //     name: `POI ${poiNum}`,
        //     coords: { lng, lat },
        //     tags: null,
        // });
        selectPoi(id);

        selectedMarkerRef.current = poiMarker;
        // selectedMarkerRef.current.popup = popup;

        setPoiNum(poiNum++);
        setControlPanelState("AddPin");
    };

    const addHazardMarker = (marker: Marker, lng: number, lat: number) => {
        if (!map.current) return;

        marker?.getPopup()?.remove();
        marker?.remove();

        // Default radius in meters
        let radius = 50;
        const minRadius = 10;
        const maxRadius = 200;

        // Create hazard marker element
        const hazardEl = document.createElement("div");
        hazardEl.className = 'hazard-marker';
        hazardEl.style.width = hazardEl.style.height = `${radius * 2}px`;
        hazardEl.style.position = 'absolute';
        hazardEl.style.transform = 'translate(-50%, -50%)'; 


        // Exclamation mark
        const exclamation = document.createElement("div");
        exclamation.className = 'hazard-marker-exclamation';
        exclamation.innerText = '!';
        hazardEl.appendChild(exclamation);

        // Popup container
        const popupContainer = document.createElement("div");

        // React popup for radius control
        function HazardRadiusPopup({ onConfirm, onCancel, radius, setRadius }: any) {
            return (
                <div className="bg-backplate rounded-2xl p-4 min-w-[220px] text-white border-[1.5px] border-light-purple shadow-lg flex flex-col items-center">
                    <div className="flex items-center mb-3">
                    <PrimaryButton style={{ minWidth: 36, height: 36, fontSize: 24, padding: 0 }} onClick={() => setRadius((r: number) => Math.max(minRadius, r - 5))}>-</PrimaryButton>
                    <span className="mx-[18px] text-2xl">{radius}m</span>
                    <PrimaryButton style={{ minWidth: 36, height: 36, fontSize: 24, padding: 0 }} onClick={() => setRadius((r: number) => Math.min(maxRadius, r + 5))}>+</PrimaryButton>
                    </div>
                    <div className="flex gap-4 w-full justify-center">
                    <PrimaryButton style={{ flex: 1, background: 'transparent', border: '1.5px solid #9D89FF', color: '#9D89FF' }} onClick={onCancel}>Cancel</PrimaryButton>
                    <PrimaryButton style={{ flex: 1 }} onClick={onConfirm}>Confirm</PrimaryButton>
                    </div>
                </div>
            );
        }

        // React state for popup
        let setPopupRadius: (r: number | ((r: number) => number)) => void = () => {};
        let popupRadius = radius;
        
        function PopupWrapper() {
            const [r, setR] = React.useState(radius);
            const [label, setLabel] = React.useState(r > 100 ? "Large Crater" : "Small Crater");

            setPopupRadius = setR;
            popupRadius = r;

            React.useEffect(() => { // Update marker size
                hazardEl.style.width = hazardEl.style.height = `${r * 2}px`;
            }, [r]);

            React.useEffect(() => { //Update marker name
                const labelInput = document.createElement("input");
                labelInput.value = label;
                labelInput.className = "absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-100/20 border border-red-500 text-sm font-semibold rounded-md px-2 py-[2px] backdrop-blur-sm text-center w-[120px]";
                labelInput.oninput = (e: any) => {
                    setLabel(e.target.value);
                    hazardEl.setAttribute("data-hazard-label", e.target.value);
                };

                labelInput.onpointerdown = (e) => e.stopPropagation();
                hazardEl.style.pointerEvents = 'auto';
                hazardEl.appendChild(labelInput);

                setTimeout(() => labelInput.focus(), 0);

                return () => {hazardEl.removeChild(labelInput);};
            }, []);

            return <HazardRadiusPopup radius={r} setRadius={setR} onConfirm={onConfirm} onCancel={onCancel} />;
        }

        // Popup logic
        const popup = new mapboxgl.Popup({ offset: -160, closeButton: false })
            .setDOMContent(popupContainer);

        // Add marker to map
        const hazardMarker = new mapboxgl.Marker(hazardEl, { anchor: 'center' })
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(map.current)
            .togglePopup();

        // Render popup
        createRoot(popupContainer).render(<PopupWrapper />);

        // Confirm/Cancel logic
        function onConfirm() {
            popup.remove();
        }
        function onCancel() {
            hazardMarker.remove();
        }
    };

    const togglePoiSelection = (selected: Boolean) => {
        if (selectedMarkerRef.current?.getElement()) {
            const element = selectedMarkerRef.current?.getElement();
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
                <div className="absolute bottom-8 right-4 flex flex-col gap-2 items-end z-10">
                    {/* Draw Path */}
                    <PrimaryButton 
                        logo={"/logo/edit-white.svg"}
                        logoClassName={"w-8 h-8"}
                        className={`
                            relative flex flex-1 px-4 py-4 justify-center items-center gap-2 flex-shrink-0 bg-galaxy-purple
                            border border-light-purple rounded-xl text-white transition-all duration-150
                            hover:bg-another-purple
                            active:bg-light-purple
                          `}
                    >
                    <Tooltip text="Draw Path"/>
                    </PrimaryButton>

                    {/* expandable button container*/}
                    <div className="flex flex-row-reverse justify-center items-center text-nowrap
                    border border-light-purple bg-galaxy-purple rounded-xl transition-all duration-150">
                        {/* expandable button*/}
                        <PrimaryButton
                            logo={`${addActive ? `/logo/minus.svg` : `logo/add-white.svg`}`}
                            logoClassName={"w-8 h-8"}
                            className={"p-4 relative hover:bg-another-purple rounded-xl"}
                            onClick={onAddClick}
                        />
                        
                        {/* popup section - add POI & add Hazard*/}
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden
                            ${addActive ? `opacity-100 mx-4 overflow-visible`: `opacity-0 w-0 pointer-events-none ml-0`} flex justify-center items-center gap-4`}>
                            <PrimaryButton>
                                <img src="/logo/hazard.svg" alt={"add-hazard"}/>
                                Add Hazard
                                <Tooltip text="Click anywhere on the map"/>
                            </PrimaryButton>

                            <PrimaryButton active={buttonActive} onClick={onPoiButtonClick}>
                                <img src="/logo/poi-stroke.svg" alt={"add-poi"}/>
                                Add POI
                                <Tooltip text="Click anywhere on the map"/>
                            </PrimaryButton>
                        </div>
                    </div>
                </div>

                {/* ZoomIn & ZoomOut*/}
                <div className="absolute bottom-8 left-6 z-10">
                    <div className="flex flex-col items-center justify-center border border-light-purple rounded-xl bg-light-purple/20 backdrop-blur-sm overflow-hidden">

                         <TertiaryButton 
                            onClick={() => map.current?.zoomIn()} 
                            logo="/logo/zoom-in.svg" 
                            className="rounded-none p-3" 
                        />

                        {/* divider */}
                        <div className="w-8 h-px bg-light-purple opacity-50" />

                        <TertiaryButton 
                            onClick={() => map.current?.zoomOut()} 
                            logo="/logo/zoom-out.svg" 
                            className="rounded-none p-3" 
                        />
                            
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasicMap;