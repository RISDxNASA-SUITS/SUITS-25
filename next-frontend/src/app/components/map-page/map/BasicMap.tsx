"use client";

import React, { useEffect, useState, RefObject, useCallback } from 'react';
import { Map,Marker, Popup, ViewStateChangeEvent, MapMouseEvent } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css'; // Keep for base styles
import PrimaryButton from "@/app/components/ui/ui-buttons/PrimaryButton";
import { PoiStore, PinTypes, Poi } from "@/app/hooks/PoiStore";
import { nanoid } from "nanoid";
import TertiaryButton from "@/app/components/ui/ui-buttons/TertiaryButton";
import { Tooltip } from '../../ui/ui-buttons/Tooltip';
import "../mapstyle.css"; // Keep custom styles

// Mapbox token (ensure this is the correct way to set it for react-map-gl, often passed as a prop)
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGtpbWgiLCJhIjoiY203dGU2djRzMXZxdzJrcHNnejd3OGVydSJ9.pIfFx8HCC58f_PzAUjALRQ';

type BasicMapProps = {
    roverCoords: { x: number; y: number };
    setControlPanelState: (state: "EvDetails" | "AddPin" | "SelectPin" | "AddTag") => void;
    // selectedMarkerRef is problematic with declarative rendering. We'll rely on selectedPoiId from the store.
    // Consider removing or rethinking its purpose. For now, I'll leave it but comment out its direct uses if they conflict.
    selectedMarkerRef: RefObject<any>; // Type will change from mapboxgl.Marker
}

// Initial viewport settings
const initialViewState = {
    longitude: -95.081213,
    latitude: 29.564795,
    zoom: 18.8,
    pitch: 0,
    bearing: 0,
    padding: {top: 0, bottom: 0, left: 0, right: 0}
};

const BasicMap = ({ roverCoords, setControlPanelState, selectedMarkerRef }: BasicMapProps) => {
    const [viewState, setViewState] = useState(initialViewState);
    const { pois, addPoi, selectPoi, selectedPoiId, loadFromBackend, updatePoi } = PoiStore();
    const [poiNum, setPoiNum] = useState(1); // For default naming, might need better persistence

    const [newPinLocation, setNewPinLocation] = useState<{ lng: number; lat: number } | null>(null);
    const [tempPinType, setTempPinType] = useState<PinTypes | null>(null);
    const [hazardRadius, setHazardRadius] = useState(50); // Default hazard radius

    // For the expandable add menu
    const [addActive, toggleAddActive] = useState<boolean>(false);
    const [poiButtonClickActive, setPoiButtonClickActive] = useState<boolean>(false);


    useEffect(() => {
        loadFromBackend();
    }, [loadFromBackend]);

    // This effect is no longer needed as markers are rendered declaratively
    // useEffect(()=> {
    //     pois.forEach(x => x.addMarkerFromBackend()) // This method needs to be removed from Poi type or re-evaluated
    // }, [pois])

    const handleMapClick = useCallback((event: MapMouseEvent) => {
        // If "Add POI" button is active, place a new pin
        if (poiButtonClickActive) {
            const { lng, lat } = event.lngLat;
            setNewPinLocation({ lng, lat });
            // Do not open popup here, wait for user to choose POI or Hazard from menu
            // Or, if the intention is to immediately show a temp pin, this logic needs to be adjusted
            setControlPanelState("EvDetails"); // Or perhaps a new state like "ConfirmPinPlacement"
            // Deselect "Add POI" button mode
            setPoiButtonClickActive(false);
            toggleAddActive(false); // Close the add menu
        } else {
            // If not in "Add POI" mode, deselect any selected POI
            // Check if the click was on a marker (handled by marker's onClick) or map
            // If on map, and not on a marker, deselect
            const target = event.originalEvent.target as HTMLElement;
            if (!target.closest('.mapboxgl-marker')) {
                 selectPoi(null);
                 setControlPanelState("EvDetails");
            }
        }
    }, [poiButtonClickActive, selectPoi, setControlPanelState]);


    const onPoiButtonClick = () => {
        setPoiButtonClickActive(!poiButtonClickActive);
        if (newPinLocation) {
            setNewPinLocation(null); // Clear temp pin if button is toggled off
        }
        if (!poiButtonClickActive) { // If turning on
            toggleAddActive(true); // Ensure menu is open
        } else { // If turning off
            toggleAddActive(false);
        }
    };
    
    // Generic function to add a new POI or Hazard to the store
    const addNewPinToStore = (lng: number, lat: number, type: PinTypes, namePrefix: string, additionalData?: Partial<Poi>) => {
        const newId = nanoid();
        const newPoi: Poi = { // Adjusted type to satisfy PoiStore for now
            id: newId,
            name: `${namePrefix} ${poiNum}`,
            coords: { lng, lat },
            tags: null,
            type: type,
           
            ...additionalData,
        };
        addPoi(newPoi); // Type assertion, assuming PoiStore.Poi will be updated
        setPoiNum(prev => prev + 1);
        selectPoi(newId); // Select the newly added POI
        setControlPanelState(type === "hazard" ? "EvDetails" : "AddPin"); // Different panel states
        setNewPinLocation(null); // Clear the temporary pin location
        setTempPinType(null);
    };


    const handleAddPoiFromPopup = (lng: number, lat: number) => {
        addNewPinToStore(lng, lat, "Poi", "POI");
    };

    const handleAddHazardFromPopup = (lng: number, lat: number, radius: number) => {
        // For hazards, we might store radius or other specific data
        // This part needs to be fleshed out based on how hazard data (like radius) is stored.
        // For now, just adding as a generic POI of type 'hazard'.
        // You might want to add a 'radius' field to your Poi interface or a separate store for hazards.
        console.log(`Hazard with radius ${radius}m added at ${lng}, ${lat}`);
        // Example: Storing radius in a 'details' field or custom field in PoiStore
        addNewPinToStore(lng, lat, "hazard", "Hazard", { hazardDetails: { radius } } as Partial<Poi>);
    };
    
    const onAddClick = () => {
        const newAddActiveState = !addActive;
        toggleAddActive(newAddActiveState);
        if (!newAddActiveState) { // If closing the menu
            setPoiButtonClickActive(false); // Deactivate POI button mode
            setNewPinLocation(null); // Clear any temp pin
        }
    };

    const selectedPoiDetails = pois.find(p => p.id === selectedPoiId);

    // Function to render the popup for a new pin or selected POI
    const renderPopup = () => {
        if (newPinLocation && !tempPinType) { // Temporary pin placed, show options
            return (
                <Popup
                    longitude={newPinLocation.lng}
                    latitude={newPinLocation.lat}
                    onClose={() => {
                        setNewPinLocation(null);
                        setTempPinType(null);
                    }}
                    closeButton={true}
                    closeOnClick={false}
                    anchor="bottom"
                    offset={15}
                >
                    <div className="p-2 bg-backplate rounded-md shadow-lg flex flex-col gap-2">
                        <PrimaryButton onClick={() => {
                            setTempPinType("Poi")
                            // No direct add here, wait for confirm from panel or another UI element
                        }}>
                            +POI
                        </PrimaryButton>
                        <PrimaryButton onClick={() => {
                             setTempPinType("hazard");
                             // Open radius selection or directly add with default
                        }}>
                            +Hazard
                        </PrimaryButton>
                    </div>
                </Popup>
            );
        } else if (newPinLocation && tempPinType === "Poi") {
            // Logic to confirm POI addition, perhaps via ControlPanel
            // For now, directly adding
            handleAddPoiFromPopup(newPinLocation.lng, newPinLocation.lat);
            setNewPinLocation(null); // Pin handled
            setTempPinType(null);

        } else if (newPinLocation && tempPinType === "hazard") {
            // Show hazard radius controls
            return (
                 <Popup
                    longitude={newPinLocation.lng}
                    latitude={newPinLocation.lat}
                    onClose={() => {
                        setNewPinLocation(null);
                        setTempPinType(null);
                    }}
                    closeButton={true}
                    closeOnClick={false}
                    anchor="bottom"
                    offset={15}
                    className="min-w-[250px]"
                >
                   <HazardRadiusPopup
                        initialRadius={hazardRadius}
                        onConfirm={(radius) => {
                            handleAddHazardFromPopup(newPinLocation.lng, newPinLocation.lat, radius);
                            setNewPinLocation(null);
                            setTempPinType(null);
                        }}
                        onCancel={() => {
                            setNewPinLocation(null);
                            setTempPinType(null);
                        }}
                    />
                </Popup>
            );
        }


        if (selectedPoiDetails) {
            return (
                <Popup
                    longitude={selectedPoiDetails.coords.lng}
                    latitude={selectedPoiDetails.coords.lat}
                    onClose={() => selectPoi(null)}
                    closeButton={false} // Assuming close is handled by selecting another or closing panel
                    anchor="bottom-left"
                    offset={16} // Adjust as needed
                    className="custom-final-popup z-20" // Ensure z-index if needed
                >
                    <div>{selectedPoiDetails.name}</div>
                </Popup>
            );
        }
        return null;
    };
    
    // Hazard Radius Popup Component (can be moved to a separate file)
    function HazardRadiusPopup({ initialRadius, onConfirm, onCancel }: { initialRadius: number, onConfirm: (radius: number) => void, onCancel: () => void}) {
        const [radius, setRadius] = useState(initialRadius);
        const minRadius = 10;
        const maxRadius = 200;

        return (
            <div className="bg-backplate rounded-2xl p-4 min-w-[220px] text-white border-[1.5px] border-light-purple shadow-lg flex flex-col items-center">
                <div className="flex items-center mb-3">
                <PrimaryButton style={{ minWidth: 36, height: 36, fontSize: 24, padding: 0 }} onClick={() => setRadius((r: number) => Math.max(minRadius, r - 5))}>-</PrimaryButton>
                <span className="mx-[18px] text-2xl">{radius}m</span>
                <PrimaryButton style={{ minWidth: 36, height: 36, fontSize: 24, padding: 0 }} onClick={() => setRadius((r: number) => Math.min(maxRadius, r + 5))}>+</PrimaryButton>
                </div>
                <div className="flex gap-4 w-full justify-center">
                <PrimaryButton style={{ flex: 1, background: 'transparent', border: '1.5px solid #9D89FF', color: '#9D89FF' }} onClick={onCancel}>Cancel</PrimaryButton>
                <PrimaryButton style={{ flex: 1 }} onClick={() => onConfirm(radius)}>Confirm</PrimaryButton>
                </div>
            </div>
        );
    }


    //This function is to be used when "Add POI" from the bottom menu is clicked.
    //It prepares the state for a map click to place a POI.
    const preparePoiAddition = () => {
        setPoiButtonClickActive(true); // Enable map click for POI
        setNewPinLocation(null);   // Clear any previous temporary pin
        setTempPinType("Poi");     // Set the type we intend to add
        toggleAddActive(false);    // Close the expandable menu
        setControlPanelState("EvDetails"); // Or a state like "PlacingPin"
    };

    //This function is to be used when "Add Hazard" from the bottom menu is clicked.
    //It prepares the state for a map click to place a Hazard.
    const prepareHazardAddition = () => {
        setPoiButtonClickActive(true); // Enable map click for Hazard
        setNewPinLocation(null);    // Clear any previous temporary pin
        setTempPinType("hazard");   // Set the type we intend to add
        toggleAddActive(false);     // Close the expandable menu
        setControlPanelState("EvDetails"); // Or a state like "PlacingPin"
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
            
            <div className="map-container">
                <Map
                    {...viewState}
                    onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
                    mapboxAccessToken={MAPBOX_TOKEN}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle="mapbox://styles/dkimh/cm9k7yru7008601s617bl7zmh/draft" // Your map style
                    onClick={handleMapClick}
                    doubleClickZoom={false} // If you want to disable double click zoom to use it for other things
                >
                    {pois.map(poi => (
                        <Marker
                            key={poi.id}
                            longitude={poi.coords.lng}
                            latitude={poi.coords.lat}
                            onClick={(e: MapLayerMouseEvent) => {
                                e.originalEvent.stopPropagation(); // Prevent map click from firing
                                selectPoi(poi.id);
                                setControlPanelState(poi.type === "hazard" ? "EvDetails" : "SelectPin"); // Or "EditPin" if that's the flow
                                // selectedMarkerRef.current = ???; // react-map-gl doesn't expose marker instances easily this way.
                                                                // This ref might need to be handled differently, e.g., by finding the DOM element if absolutely necessary.
                            }}
                        >
                            {/* Custom marker element */}
                            <div
                                className={`
                                    bg-contain bg-no-repeat bg-center cursor-pointer
                                    ${poi.type === 'hazard' ? 'w-5 h-5' : 'sm:w-5m md:w-6 lg:w-7 sm:h-5 md:h-6 lg:h-7'}
                                `}
                                style={{
                                    backgroundImage: poi.type === 'hazard'
                                        ? 'url(/markers/hazard-icon.svg)' // Replace with actual hazard icon
                                        : poi.id === selectedPoiId
                                            ? 'url(/markers/selected-poi.svg)'
                                            : 'url(/markers/default-poi.svg)',
                                    // If hazard needs dynamic sizing based on radius:
                                    // width: poi.type === 'hazard' ? `${poi.hazardDetails?.radius * 2}px` : undefined,
                                    // height: poi.type === 'hazard' ? `${poi.hazardDetails?.radius * 2}px` : undefined,
                                }}
                            >
                                {poi.type === 'hazard' && (
                                    <div className="hazard-marker-exclamation text-center text-red-500 font-bold">!</div>
                                )}
                            </div>
                        </Marker>
                    ))}

                    {renderPopup()}

                </Map>
                <div className="map-grid-overlay pointer-events-none" />

                {/* UI Elements: Add Marker Menu, Zoom Controls */}
                {/* These can largely remain the same, but their onClick handlers might change */}
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
                            onClick={onAddClick} // Toggles the add menu
                        />
                        
                        {/* popup section - add POI & add Hazard*/}
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden
                            ${addActive ? `opacity-100 mx-4 overflow-visible`: `opacity-0 w-0 pointer-events-none ml-0`} flex justify-center items-center gap-4`}>
                            <PrimaryButton onClick={prepareHazardAddition}> {/* Updated onClick */}
                                <img src="/logo/hazard.svg" alt={"add-hazard"}/>
                                Add Hazard
                                <Tooltip text="Click anywhere on the map"/>
                            </PrimaryButton>

                            <PrimaryButton active={poiButtonClickActive} onClick={preparePoiAddition}> {/* Updated onClick and active state */}
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
                            onClick={() => setViewState(v => ({...v, zoom: Math.min(22, v.zoom + 1), longitude: v.longitude, latitude: v.latitude, pitch: v.pitch, bearing: v.bearing, padding: v.padding}))} 
                            logo="/logo/zoom-in.svg" 
                            className="rounded-none p-3" 
                        />
                        <div className="w-8 h-px bg-light-purple opacity-50" />
                        <TertiaryButton 
                            onClick={() => setViewState(v => ({...v, zoom: Math.max(0, v.zoom - 1), longitude: v.longitude, latitude: v.latitude, pitch: v.pitch, bearing: v.bearing, padding: v.padding}))}
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