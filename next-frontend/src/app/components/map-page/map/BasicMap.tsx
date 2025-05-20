"use client";

import React, { useEffect, useState, RefObject, useCallback } from 'react';
import { Map,Marker, Popup, ViewStateChangeEvent, MapMouseEvent } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css'; // Keep for base styles
import PrimaryButton from "@/app/components/ui/ui-buttons/PrimaryButton";
import { PoiStore, PinTypes, Poi, HazardPoi, LtvPoi } from "@/app/hooks/PoiStore";
import { nanoid } from "nanoid";
import TertiaryButton from "@/app/components/ui/ui-buttons/TertiaryButton";
import { Tooltip } from '../../ui/ui-buttons/Tooltip';
import "../mapstyle.css"; // Keep custom styles
import mapboxgl from 'mapbox-gl';
import { createRoot } from 'react-dom/client';
import Warnings from '@/app/components/map-page/mission-info/Warnings'

// Mapbox token (ensure this is the correct way to set it for react-map-gl, often passed as a prop)
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGtpbWgiLCJhIjoiY203dGU2djRzMXZxdzJrcHNnejd3OGVydSJ9.pIfFx8HCC58f_PzAUjALRQ';

type BasicMapProps = {
    roverCoords: { x: number; y: number };
    setControlPanelState: (state: "EvDetails" | "AddPin" | "SelectPin" | "AddTag" | "SelectHazard" | "AddHazard") => void;
    // selectedMarkerRef is problematic with declarative rendering. We'll rely on selectedPoiId from the store.
    // Consider removing or rethinking its purpose. For now, I'll leave it but comment out its direct uses if they conflict.
    selectedMarkerRef: RefObject<any>; // Type will change from mapboxgl.Marker
}

type MapboxCoord = {
    lat: number;
    lng: number;
};

type MoonCoord = {
    x: number;
    y: number;
};

// Initial viewport settings
const initialViewState = {
    longitude: -95.081213,
    latitude: 29.564795,
    zoom: 18.8,
    pitch: 0,
    bearing: 0,
    padding: {top: 0, bottom: 0, left: 0, right: 0}
};
    // }, [pois])
    export function convertMoonToEarth(moon: MoonCoord): MapboxCoord {
        // Moon (x, y) for 4 corners
        const topLeft: MoonCoord = { x: -6550, y: -9750 };
        const topRight: MoonCoord = { x: -5450, y: -9750 };
        const bottomLeft: MoonCoord = { x: -6550, y: -10450 };
        const bottomRight: MoonCoord = { x: -5450, y: -10450 };

        const mapTopLeft: MapboxCoord = { lat: 29.565142600082694, lng: -95.08176351207713 };
        const mapTopRight: MapboxCoord = { lat: 29.565142380800154, lng: -95.08066260052011 };
        const mapBottomLeft: MapboxCoord = { lat: 29.564467668240866, lng: -95.08176413546131 };
        const mapBottomRight: MapboxCoord = { lat: 29.564467418688906, lng: -95.0806628133406 };

        const u = (moon.x - topLeft.x) / (topRight.x - topLeft.x);
        const v = (moon.y - topLeft.y) / (bottomLeft.y - topLeft.y);

        const topX = mapTopLeft.lng + u * (mapTopRight.lng - mapTopLeft.lng);
        const topY = mapTopLeft.lat + u * (mapTopRight.lat - mapTopLeft.lat);
        const bottomX = mapBottomLeft.lng + u * (mapBottomRight.lng - mapBottomLeft.lng);
        const bottomY = mapBottomLeft.lat + u * (mapBottomRight.lat - mapBottomLeft.lat);

        const earthX = topX + v * (bottomX - topX);
        const earthY = topY + v * (bottomY - topY);

        return {lat: earthY, lng: earthX}
    }
    export function convertEarthToMoon(earth: MapboxCoord): MoonCoord {
        // Earth (lat, lon) for 4 corners
        const topLeft: MapboxCoord = { lat: 29.565142600082694, lng: -95.08176351207713 };
        const topRight: MapboxCoord = { lat: 29.565142380800154, lng: -95.08066260052011 };
        const bottomLeft: MapboxCoord = { lat: 29.564467668240866, lng: -95.08176413546131 };
        const bottomRight: MapboxCoord = { lat: 29.564467418688906, lng: -95.0806628133406 };

        // Moon (x, y) for same corners
        const moonTopLeft: MoonCoord = { x: -6550, y: -9750 };
        const moonTopRight: MoonCoord = { x: -5450, y: -9750 };
        const moonBottomLeft: MoonCoord = { x: -6550, y: -10450 };
        const moonBottomRight: MoonCoord = { x: -5450, y: -10450 };

        // Convert lat/lon to normalized positions (u,v) between 0 and 1
        const u = (earth.lng - topLeft.lng) / (topRight.lng - topLeft.lng);
        const v = (earth.lat - topLeft.lat) / (bottomLeft.lat - topLeft.lat);

        // Interpolate Moon coordinates
        const topX = moonTopLeft.x + u * (moonTopRight.x - moonTopLeft.x);
        const topY = moonTopLeft.y + u * (moonTopRight.y - moonTopLeft.y);
        const bottomX = moonBottomLeft.x + u * (moonBottomRight.x - moonBottomLeft.x);
        const bottomY = moonBottomLeft.y + u * (moonBottomRight.y - moonBottomLeft.y);

        const moonX = topX + v * (bottomX - topX);
        const moonY = topY + v * (bottomY - topY);

        return { x: moonX, y: moonY };
    }

const BasicMap = ({ roverCoords, setControlPanelState, selectedMarkerRef }: BasicMapProps) => {
    const [viewState, setViewState] = useState(initialViewState);
    const { pois, hazardPois,  addPoi, addHazardPoi, selectPoi, selectedPoiId, loadFromBackend, breadCrumbs } = PoiStore();
    const [poiNum, setPoiNum] = useState(1); // For default naming, might need better persistence

    const pointA = convertMoonToEarth({ x: -5855.60, y: -10168.60 });
    const pointB = convertMoonToEarth({ x: -5868.10, y: -10016.10 });
    const pointC = convertMoonToEarth({ x: -5745.90, y: -9977.30 });

    const [newPinLocation, setNewPinLocation] = useState<{ lng: number; lat: number } | null>(null);
    const [tempPinType, setTempPinType] = useState<PinTypes | null>(null);
    const [hazardRadius, setHazardRadius] = useState(50); // Default hazard radius
    const [tempHazardPin, setTempHazardPin] = useState<{lng: number, lat: number, radius: number} | null>(null);
    const [tempLtvPin, setTempLtvPin] = useState<{lng: number, lat: number, radius: number} | null>(null);
   
        const [tempHazardCategory, setTempHazardCategory] = useState<'warning' | 'caution'>('warning');

    // For the expandable add menu
    const [addActive, toggleAddActive] = useState<boolean>(false);
    const [poiButtonClickActive, setPoiButtonClickActive] = useState<boolean>(false);


    // Add these function definitions
    const prepareHazardAddition = () => {
        setControlPanelState("AddHazard");
        setPoiButtonClickActive(false);
    };

    const prepareLtvAddition = () => {
        setPoiButtonClickActive(false);
        setControlPanelState("AddPin");
    };

    const preparePoiAddition = () => {
        setPoiButtonClickActive(true);
        setControlPanelState("AddPin");
    };

    useEffect(() => {
        loadFromBackend();
        const timeout = setInterval(() => {
            loadFromBackend();
        }, 1000);
        return () => clearInterval(timeout);
    }, [loadFromBackend]);

    // This effect is no longer needed as markers are rendered declaratively
    // useEffect(()=> {
    //     pois.forEach(x => x.addMarkerFromBackend()) // This method needs to be removed from Poi type or re-evaluated
    // }, [pois])
    
    // function convertEarthToMoon(earth: MapboxCoord): MoonCoord {
    //     // Earth (lat, lon) for 4 corners
    //     const topLeft: MapboxCoord = { lat: 29.565142600082694, lng: -95.08176351207713 };
    //     const topRight: MapboxCoord = { lat: 29.565142380800154, lng: -95.08066260052011 };
    //     const bottomLeft: MapboxCoord = { lat: 29.564467668240866, lng: -95.08176413546131 };
    //     const bottomRight: MapboxCoord = { lat: 29.564467418688906, lng: -95.0806628133406 };
        
    //     // Moon (x, y) for same corners
    //     const moonTopLeft: MoonCoord = { x: -6550, y: -9750 };
    //     const moonTopRight: MoonCoord = { x: -5450, y: -9750 };
    //     const moonBottomLeft: MoonCoord = { x: -6550, y: -10450 };
    //     const moonBottomRight: MoonCoord = { x: -5450, y: -10450 };
        
    //     // Convert lat/lon to normalized positions (u,v) between 0 and 1
    //     const u = (earth.lng - topLeft.lng) / (topRight.lng - topLeft.lng);
    //     const v = (earth.lat - topLeft.lat) / (bottomLeft.lat - topLeft.lat);
        
    //     // Interpolate Moon coordinates
    //     const topX = moonTopLeft.x + u * (moonTopRight.x - moonTopLeft.x);
    //     const topY = moonTopLeft.y + u * (moonTopRight.y - moonTopLeft.y);
    //     const bottomX = moonBottomLeft.x + u * (moonBottomRight.x - moonBottomLeft.x);
    //     const bottomY = moonBottomLeft.y + u * (moonBottomRight.y - moonBottomLeft.y);
        
    //     const moonX = topX + v * (bottomX - topX);
    //     const moonY = topY + v * (bottomY - topY);
        
    //     return { x: moonX, y: moonY };
    // }
    
    // function convertMoonToEarth(moon: MoonCoord): MapboxCoord {
    //     // Earth (lat, lon) for 4 corners
    //     const topLeft: MapboxCoord = { lat: 29.565142600082694, lng: -95.08176351207713 };
    //     const topRight: MapboxCoord = { lat: 29.565142380800154, lng: -95.08066260052011 };
    //     const bottomLeft: MapboxCoord = { lat: 29.564467668240866, lng: -95.08176413546131 };
    //     const bottomRight: MapboxCoord = { lat: 29.564467418688906, lng: -95.0806628133406 };
        
    //     // Moon (x, y) for same corners
    //     const moonTopLeft: MoonCoord = { x: -6550, y: -9750 };
    //     const moonTopRight: MoonCoord = { x: -5450, y: -9750 };
    //     const moonBottomLeft: MoonCoord = { x: -6550, y: -10450 };
    //     const moonBottomRight: MoonCoord = { x: -5450, y: -10450 };
        
    //     // Convert MoonCoord to normalized (u, v)
    //     const u = (moon.x - moonTopLeft.x) / (moonTopRight.x - moonTopLeft.x);
    //     const v = (moon.y - moonTopLeft.y) / (moonBottomLeft.y - moonTopLeft.y);
        
    //     // Interpolate lat/lng
    //     const topLng = topLeft.lng + u * (topRight.lng - topLeft.lng);
    //     const topLat = topLeft.lat + u * (topRight.lat - topLeft.lat);
    //     const bottomLng = bottomLeft.lng + u * (bottomRight.lng - bottomLeft.lng);
    //     const bottomLat = bottomLeft.lat + u * (bottomRight.lat - bottomLeft.lat);
        
    //     const lng = topLng + v * (bottomLng - topLng);
    //     const lat = topLat + v * (bottomLat - topLat);
        
    //     return { lat, lng };
    // }
    
    const handleMapClick = useCallback((event: MapMouseEvent) => {
        const { lng, lat } = event.lngLat;
      
        const moonCord = convertEarthToMoon({lat, lng});
       
        setNewPinLocation({ lng, lat });
        setTempPinType(null); // Reset temp pin type
        setControlPanelState("EvDetails");
        // Deselect any selected POI
        selectPoi(null);
    }, [setControlPanelState, selectPoi]);

    // Add this new component for the temporary marker
    const TemporaryMarker = ({ lng, lat }: { lng: number; lat: number }) => (
        <Marker
            longitude={lng}
            latitude={lat}
        >
            <div
                className="w-2 h-2 sm:w-2 sm:h-2 md:w-3 md:h-3 lg:w-3 lg:h-3 xl:w-3 xl:h-3 bg-contain bg-no-repeat bg-center"
                style={{ backgroundImage: 'url(/markers/marker.svg)' }}
            />
        </Marker>
    );

    function renderRoverMarker({ x, y }: { x: number; y: number }) {
        const roverCoords = convertMoonToEarth({x: x, y: y})
        return (
            <Marker
                longitude={roverCoords.lng}
                latitude={roverCoords.lat}
            >
                <div
                    className="bg-contain bg-no-repeat bg-center cursor-pointer
                                    lg:w-8 sm:h-6 md:h-7 lg:h-8"
                    style={{backgroundImage: 'url(/markers/rover-marker.svg)'}}
                />
            </Marker>
        )
    }

    // const onPoiButtonClick = () => {
    //     setPoiButtonClickActive(!poiButtonClickActive);
    //     if (newPinLocation) {
    //         setNewPinLocation(null); // Clear temp pin if button is toggled off
    //     }
    //     if (!poiButtonClickActive) { // If turning on
    //         toggleAddActive(true); // Ensure menu is open
    //     } else { // If turning off
    //         toggleAddActive(false);
    //     }
    // };

    // Generic function to add a new POI
    const addNewPinToStore = (
        lng: number,
        lat: number,
        x: number,
        y: number,
        type: PinTypes,
        namePrefix: string,
        additionalData?: Partial<Poi>,
        hazardRadius?: number,
        hazardCategory?: 'warning' | 'caution'
    ) => {
        
        if (type === 'hazard') {
            const newHazardPoi: HazardPoi = {
                
                name: `${namePrefix} ${poiNum}`,
                coords: { lng, lat },
                moonCoords: { x, y },
                tags: [],
                type: 'hazard' as const,
                radius: hazardRadius ?? 50,
                hazardCategory: hazardCategory ?? 'warning',
              
                // marker: new mapboxgl.Marker() // Add the required marker property
            };
            addHazardPoi(newHazardPoi);
            setPoiNum(prev => prev + 1);
            
            setControlPanelState("AddHazard");
            setNewPinLocation(null);
            setTempPinType(null);
            return;
        }
       
        // Normal POI
        const newPoi: Poi = {
            name: `${namePrefix} ${poiNum}`,
            coords: { lng, lat },
            moonCoords: { x, y },
            tags: [],
            type: type,
            audioId: null,
            // marker: new mapboxgl.Marker(), // Add the required marker property
            ...additionalData,
        };
        addPoi(newPoi);
        setPoiNum(prev => prev + 1);;
        setControlPanelState("AddPin");
        setNewPinLocation(null);
        setTempPinType(null);
    };


    const handleAddPoiFromPopup = (lng: number, lat: number) => {
        const moonCord = convertEarthToMoon({lat, lng});
        console.log("WE HAVE ADDED A POI")
        addNewPinToStore(lng, lat, moonCord.x, moonCord.y, "Poi", "POI");
    };

    const handleAddHazardFromPopup = (lng: number, lat: number, radius: number) => {
        const moonCord = convertEarthToMoon({lat, lng});
        console.log("WE HAVE ADDED A HAZARD")
        addNewPinToStore(lng, lat, moonCord.x, moonCord.y, "hazard", "Hazard", undefined, radius);
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
        console.log("RENDER POPUP"
        , newPinLocation, tempPinType, !tempPinType
        )
        if (newPinLocation && !tempPinType) { // Temporary pin placed, show options
            console.log("RENDER POPUP 1")
            return (
                <Popup
                    longitude={newPinLocation.lng}
                    latitude={newPinLocation.lat}
                    onClose={() => {
                        setNewPinLocation(null);
                        setTempPinType(null);
                        setTempHazardPin(null);
                        // setTempLtvPin(null);
                    }}
                    closeButton={false}
                    closeOnClick={false}
                    anchor="bottom"
                    offset={5}
                >
                    <div className="p-2 rounded-md shadow-lg flex flex-col gap-1">
                        <PrimaryButton
                            logo={"/logo/poi-stroke.svg"}
                            onClick={() => {
                            handleAddPoiFromPopup(newPinLocation.lng, newPinLocation.lat);
                            setNewPinLocation(null);
                        }}>
                            +POI
                        </PrimaryButton>
                        <PrimaryButton
                            logo={"/logo/poi-stroke.svg"}
                            onClick={() => {
                            setTempPinType("hazard");
                            setHazardRadius(50);
                            setTempHazardPin({lng: newPinLocation.lng, lat: newPinLocation.lat, radius: 50});
                        }}>
                            +Hazard
                        </PrimaryButton>
                        
                    </div>
                </Popup>
            );
        } else if (newPinLocation && tempPinType === "hazard") {
            // Show hazard radius controls
            return (
                <Popup
                    longitude={newPinLocation.lng}
                    latitude={newPinLocation.lat}
                    onClose={() => {
                        setNewPinLocation(null);
                        setTempPinType(null);
                        setTempHazardPin(null);
                    }}
                    closeButton={true}
                    closeOnClick={false}
                    anchor="bottom"
                    offset={15}
                    className="min-w-[250px]"
                >
                    <HazardRadiusPopup
                        initialRadius={hazardRadius}
                        onRadiusChange={(radius) => {
                            setHazardRadius(radius);
                            setTempHazardPin((prev) => prev ? {...prev, radius} : prev);
                        }}
                        onConfirm={(radius) => {
                            handleAddHazardFromPopup(newPinLocation.lng, newPinLocation.lat, radius);
                            setNewPinLocation(null);
                            setTempPinType(null);
                            setTempHazardPin(null);
                        }}
                        onCancel={() => {
                            setNewPinLocation(null);
                            setTempPinType(null);
                            setTempHazardPin(null);
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
                    offset={15}
                    className="custom-final-popup z-20" // Ensure z-index if needed
                >
                    <div>{selectedPoiDetails.name}</div>
                </Popup>
            );
        }
        return null;
    };

    // Hazard Radius Popup Component (can be moved to a separate file)
    function HazardRadiusPopup({ initialRadius, onRadiusChange, onConfirm, onCancel }: { initialRadius: number, onRadiusChange: (radius: number) => void, onConfirm: (radius: number) => void, onCancel: () => void}) {
        const [radius, setRadius] = useState(initialRadius);
        const minRadius = 10;
        const maxRadius = 200;

        const handleSetRadius = (newRadius: number) => {
            setRadius(newRadius);
            onRadiusChange(newRadius);
        };

            return (
                <div className="bg-backplate rounded-2xl p-4 min-w-[220px] text-white border-[1.5px] border-light-purple shadow-lg flex flex-col items-center">
                    <div className="flex items-center mb-3">
                <PrimaryButton style={{ minWidth: 36, height: 36, fontSize: 24, padding: 0 }} onClick={() => handleSetRadius(Math.max(minRadius, radius - 5))}>-</PrimaryButton>
                    <span className="mx-[18px] text-2xl">{radius}m</span>
                <PrimaryButton style={{ minWidth: 36, height: 36, fontSize: 24, padding: 0 }} onClick={() => handleSetRadius(Math.min(maxRadius, radius + 5))}>+</PrimaryButton>
                    </div>
                    <div className="flex gap-4 w-full justify-center">
                    <PrimaryButton style={{ flex: 1, background: 'transparent', border: '1.5px solid #9D89FF', color: '#9D89FF' }} onClick={onCancel}>Cancel</PrimaryButton>
                <PrimaryButton style={{ flex: 1 }} onClick={() => onConfirm(radius)}>Confirm</PrimaryButton>
                </div>
                </div>
            );
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

            <div className="map-container">
                <Map
                    {...viewState}
                    onMove={(evt: ViewStateChangeEvent) => {
                        const vs = evt.viewState;
                        setViewState({
                            ...vs,
                            padding: {
                                top: vs.padding?.top ?? 0,
                                bottom: vs.padding?.bottom ?? 0,
                                left: vs.padding?.left ?? 0,
                                right: vs.padding?.right ?? 0,
                            }
                        });
                    }}
                    mapboxAccessToken={MAPBOX_TOKEN}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle="mapbox://styles/dkimh/cm9k7yru7008601s617bl7zmh/draft"
                    onClick={handleMapClick}
                    doubleClickZoom={false}
                >
                    {/* Add temporary marker when map is clicked */}
                    {newPinLocation && !tempPinType && (
                        <TemporaryMarker lng={newPinLocation.lng} lat={newPinLocation.lat} />
                    )}

                    {/* Render normal POIs */}
                    {pois.map(poi => (
                        <Marker
                            key={poi.id}
                            longitude={poi.coords.lng}
                            latitude={poi.coords.lat}
                            onClick={(e) => {
                                e.originalEvent.stopPropagation();
                                selectPoi(poi.id);
                                setControlPanelState("SelectPin");
                            }}
                        >
                            <div
                                className={`
                                    bg-contain bg-no-repeat bg-center cursor-pointer
                                    sm:w-5m md:w-6 lg:w-7 sm:h-5 md:h-6 lg:h-7
                                `}
                                style={{
                                    backgroundImage: poi.id === selectedPoiId
                                        ? 'url(/markers/selected-poi.svg)'
                                        : 'url(/markers/default-poi.svg)',
                                }}
                            />
                        </Marker>
                    ))}

                    {/* Render LTV POI Points (A, B, C) */}
                    <Marker longitude={pointA.lng} latitude={pointA.lat}>
                        <div
                            className={`
                                bg-contain bg-no-repeat bg-center cursor-pointer
                                sm:w-5m md:w-6 lg:w-7 sm:h-5 md:h-6 lg:h-7
                            `}
                            style={{ backgroundImage: 'url(/markers/selected-poi.svg)' }}
                            title="Point A"
                        />
                    </Marker>
                    <Popup
                        longitude={pointA.lng}
                        latitude={pointA.lat}
                        anchor="bottom"
                        offset={15}
                        closeButton={false}
                        closeOnClick={false}
                        className="custom-final-popup z-20"
                    >
                        <div>POI A</div>
                    </Popup>

                    <Marker longitude={pointB.lng} latitude={pointB.lat}>
                        <div
                            className={`
                                bg-contain bg-no-repeat bg-center cursor-pointer
                                sm:w-5m md:w-6 lg:w-7 sm:h-5 md:h-6 lg:h-7
                            `}
                            style={{ backgroundImage: 'url(/markers/selected-poi.svg)' }}
                            title="Point B"
                        />
                    </Marker>
                    <Popup
                        longitude={pointB.lng}
                        latitude={pointB.lat}
                        anchor="bottom"
                        offset={15}
                        closeButton={false}
                        closeOnClick={false}
                        className="custom-final-popup z-20"
                    >
                        <div>POI B</div>
                    </Popup>

                    <Marker longitude={pointC.lng} latitude={pointC.lat}>
                        <div
                            className={`
                                bg-contain bg-no-repeat bg-center cursor-pointer
                                sm:w-5m md:w-6 lg:w-7 sm:h-5 md:h-6 lg:h-7
                            `}
                            style={{ backgroundImage: 'url(/markers/selected-poi.svg)' }}
                            title="Point C"
                        />
                    </Marker>
                    <Popup
                        longitude={pointC.lng}
                        latitude={pointC.lat}
                        anchor="bottom"
                        offset={15}
                        closeButton={false}
                        closeOnClick={false}
                        className="custom-final-popup z-20"
                    >
                        <div>POI C</div>
                    </Popup>



                    {/* Render hazard POIs */}
                    {hazardPois.map(hazard => (
                        <Marker
                            key={hazard.id}
                            longitude={hazard.coords.lng}
                            latitude={hazard.coords.lat}
                            onClick={(e) => {
                                e.originalEvent.stopPropagation();
                                selectPoi(hazard.id);
                                setControlPanelState("SelectHazard");
                            }}
                        >
                            <div
                            className={`
                                ${hazard.hazardCategory === 'caution' ? 'bg-[#5e4331]' : 'bg-[#6e223d]'}
                                border-dotted border-2 rounded-full border-white cursor-pointer flex items-center justify-center
                            `}
                            style={{
                                width: `${hazard.radius}px`,
                                height: `${hazard.radius}px`,
                            }}
                            >
                                <div className="hazard-marker-exclamation text-center text-white font-bold text-lg">!</div>
                            </div>
                        </Marker>
                    ))}
                    {/* Render breadcrumb POIs */}
                    {breadCrumbs.map(breadcrumb => (
                        <Marker
                            key={breadcrumb.id}
                            longitude={breadcrumb.coords.lng}
                            latitude={breadcrumb.coords.lat}
                        >
                            <div className="breadcrumb-marker-exclamation text-center text-white font-bold text-lg">!</div>
                        </Marker>
                    ))}
                    {/* Render LTV POIs */}
                    
                    {/* Show temporary hazard marker while adjusting radius */}
                    {tempHazardPin && (
                        <Marker
                            longitude={tempHazardPin.lng}
                            latitude={tempHazardPin.lat}
                        >
                            <div
                                className={`${tempHazardCategory === 'caution' ? 'bg-[#5e4331]' : 'bg-[#6e223d]'} border-dotted border-2 rounded-full border-white cursor-pointer flex items-center justify-center opacity-70`}
                                style={{
                                    width: `${tempHazardPin.radius}px`,
                                    height: `${tempHazardPin.radius}px`,
                                }}
                            >
                                <div className="hazard-marker-exclamation text-center text-white font-bold text-lg">!</div>
                            </div>
                        </Marker>
                    )}
                    {renderPopup()}
                    {renderRoverMarker({x: roverCoords.x, y: roverCoords.y})}
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

                        {/* popup section - add POI & add Hazard & add LTV*/}
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden
                            ${addActive ? `opacity-100 mx-4 overflow-visible`: `opacity-0 w-0 pointer-events-none ml-0`} flex justify-center items-center gap-4`}>
                            <PrimaryButton onClick={prepareHazardAddition}> {/* Updated onClick */}
                                <img src="/logo/hazard.svg" alt={"add-hazard"}/>
                                Add Hazard
                                <Tooltip text="Click anywhere on the map"/>
                            </PrimaryButton>

                            <PrimaryButton onClick={prepareLtvAddition}> {/* Updated onClick */}
                                <img src="/logo/ltv.svg" alt={"add-ltv"}/>
                                Add LTV
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
                
                <div className = "absolute top-0 w-full flex items-end flex-col">
                    <Warnings />
                </div>
            </div>
        </div>
    );
};

export default BasicMap;
