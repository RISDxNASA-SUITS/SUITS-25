"use client";

import React, { useEffect, useState, RefObject, useCallback } from 'react';
import { Map,Marker, Popup, ViewStateChangeEvent, MapMouseEvent } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css'; // Keep for base styles
import PrimaryButton from "@/app/components/ui/ui-buttons/PrimaryButton";
import { PoiStore, PinTypes, Poi, HazardPoi, LtvPoi, GeoSample } from "@/app/hooks/PoiStore";
import { nanoid } from "nanoid";
import TertiaryButton from "@/app/components/ui/ui-buttons/TertiaryButton";
import { Tooltip } from '../../ui/ui-buttons/Tooltip';
import "../mapstyle.css"; // Keep custom styles
import mapboxgl from 'mapbox-gl';
import { createRoot } from 'react-dom/client';
import Warnings from '@/app/components/map-page/mission-info/Warnings'
import { usePanelStore } from '@/app/hooks/panelStore';

// Mapbox token (ensure this is the correct way to set it for react-map-gl, often passed as a prop)
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGtpbWgiLCJhIjoiY203dGU2djRzMXZxdzJrcHNnejd3OGVydSJ9.pIfFx8HCC58f_PzAUjALRQ';

type BasicMapProps = {
    roverCoords: { x: number; y: number };
    
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

const defaultLtvCoords = [
    { name: "LTV A", moonCoords: { x: -5855.60, y: -10168.60 } },
    { name: "LTV B", moonCoords: { x: -5868.10, y: -10016.10 } },
    { name: "LTV C", moonCoords: { x: -5745.90, y: -9977.30 } },
];

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

const BasicMap = ({ roverCoords, }: BasicMapProps) => {
    const [viewState, setViewState] = useState(initialViewState);
    const { pois, hazardPois,  addPoi, addHazardPoi, selectPoi, selectedPoiId, loadFromBackend, breadCrumbs, ltvPois, addLtvPoi } = PoiStore();
    const [poiNum, setPoiNum] = useState(1); // For default naming, might need better persistence
    const [ltvLetter, setLtvLetter] = useState("A");
    const [ltvToggle, setLtvToggle] = useState(false);
    const {setPanelState:setControlPanelState} = usePanelStore();

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
        const init = async () => {
            await loadFromBackend();
            
            // Ensure LTV points are added only if not already present
            const existingLtvNames = new Set(ltvPois.map(poi => poi.name));
            for (const { name, moonCoords } of defaultLtvCoords) {
                if (!existingLtvNames.has(name)) {
                    const earth = convertMoonToEarth(moonCoords);
                    addLtvPoi({
                        name,
                        coords: earth,
                        moonCoords,
                        tags: [],
                        type: "ltv",
                        audioId: null,
                    });
                }
            }
        };
        
        init();
        const interval = setInterval(loadFromBackend, 1000);
        return () => clearInterval(interval);
    }, [loadFromBackend, ltvPois, addLtvPoi]);

    const [isScanActive, setIsScanActive] = useState(false);

    // api.py scan_results points fetched from json backend
    const [scanPoints, setScanPoints] = useState<Array<[number, number]>>([]);

    const handleScanToggle = async () => {
        if (isScanActive) return; // Prevent multiple simultaneous scans
        
        try {
            console.log("Starting scan request");
            setIsScanActive(true);
            
            const response = await fetch('/api/rover-scan');
            console.log("Scan response status:", response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Scan failed:', errorData);
                throw new Error(errorData.error || 'Scan failed');
            }
            
            const data = await response.json();
            console.log("Scan results:", data);
            
            if (data.success) {
                console.log("Scan points:", data.points);
                var countId = 0;
                for (const point of data.points) {
                    // Create and add POI
                    const newPoi: Poi = {
                        name: `Scan ${countId}`,
                        coords: { lng: point[0], lat: point[1] },
                        moonCoords: { x: point[0], y: point[1] },
                        tags: ["geoSample"],
                        type: "geologicalSample" as PinTypes,
                        audioId: null,
                        radius: null,
                    };
                    const poiResponse = await addPoi(newPoi);
                    setPoiNum(prev => prev + 1);
                    countId++;
                }
                setScanPoints(data.points); // Store scan_results points from api.py points directly
            } else {
                throw new Error('Scan was not successful');
            }
        } catch (error) {
            console.error('Error during scan:', error);
        } finally {
            setIsScanActive(false);
        }
    };



    // This effect is no longer needed as markers are rendered declaratively
    // useEffect(()=> {
    //     pois.forEach(x => x.addMarkerFromBackend()) // This method needs to be removed from Poi type or re-evaluated
    // }, [pois])
    
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
        const [animationFrame, setAnimationFrame] = useState(0);
        const roverCoords = convertMoonToEarth({x: x, y: y});

        useEffect(() => {
            if (!isScanActive) {
                setAnimationFrame(0);
                return;
            }

            const circles = [50, 100, 200];
            const interval = setInterval(() => {
                setAnimationFrame((prev) => (prev >= circles.length - 1 ? 0 : prev + 1));
            }, 1000);

            return () => clearInterval(interval);
        }, [isScanActive]);

        return (
            <>
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
                {isScanActive && (
                    <Marker
                        longitude={roverCoords.lng}
                        latitude={roverCoords.lat}
                    >
                        <div
                            className="border-2 border-blue-500 rounded-full opacity-50 transition-all duration-500"
                            style={{
                                width: `${[50, 100, 200][animationFrame]}px`,
                                height: `${[50, 100, 200][animationFrame]}px`,
                            }}
                        />
                    </Marker>
                )}
            </>
        );
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

        if (type === "ltv") {
            const newLtvPoi: LtvPoi = {
                name: `${namePrefix} ${ltvLetter}`,
                coords: { lng, lat },
                moonCoords: { x, y },
                tags: [],
                type: type,
                audioId: null,
                // marker: new mapboxgl.Marker(), // Add the required marker property
                ...additionalData,
            }
            addLtvPoi(newLtvPoi);
            setLtvLetter(prev => String.fromCharCode(prev.charCodeAt(0) + 1));
            setControlPanelState("AddPin");
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
        // console.log("RENDER POPUP"
        // , newPinLocation, tempPinType, !tempPinType
        // )
        if (newPinLocation && !tempPinType) { // Temporary pin placed, show options
            console.log("RENDER POPUP 1")
            return (
                <Popup
                    key={`add-pin-${newPinLocation.lng}-${newPinLocation.lat}`}
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
                    mapStyle="mapbox-style/style.json"
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
                    
                    {/* Render LTV POIs */}
                    {ltvPois.map(ltv => (
                        <div key={ltv.id}>
                            <Marker
                                longitude={ltv.coords.lng}
                                latitude={ltv.coords.lat}
                                onClick={(e) => {
                                    e.originalEvent.stopPropagation(); // Prevent map click bubbling
                                    selectPoi(ltv.id);
                                    setControlPanelState("SelectPin");
                                    setLtvToggle(true);
                                }}
                            >
                                <div
                                    className="bg-contain bg-no-repeat bg-center w-6 h-6 cursor-pointer"
                                    style={{ backgroundImage: 'url(/markers/selected-poi.svg)' }}
                                />
                            </Marker>
                            
                            {/* Always-visible popup */}
                            <Popup
                                longitude={ltv.coords.lng}
                                latitude={ltv.coords.lat}
                                anchor="top"
                                offset={20}
                                closeButton={false}
                                closeOnClick={false}
                                className="custom-final-popup z-20 pointer-events-none" // make sure it doesn't intercept clicks
                            >
                                <div className="text-xs font-semibold">{ltv.name}</div>
                            </Popup>
                        </div>
                    ))}
                    
                    
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

                    {/* Add the markers for all scan_result from api.py coordinates */}
                    {(() => {
                        const scanMarkers = [];
                        for (let index = 0; index < scanPoints.length; index++) {
                            const point = scanPoints[index];
                            const earthCoords = convertMoonToEarth({x: point[0], y: point[1]});
                            scanMarkers.push(
                                <Marker
                                    key={`scan-${index}`}
                                    longitude={earthCoords.lng}
                                    latitude={earthCoords.lat}
                                >
                                    <div
                                        className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                                        title={`Scan Point ${index + 1}`}
                                    >
                                        {index + 1}
                                    </div>
                                </Marker>
                            );
                        }
                        
                        // Add a popup showing total scan points
                        if (scanPoints.length > 0) {
                            const firstPoint = scanPoints[0];
                            const popupCoords = convertMoonToEarth({x: firstPoint[0], y: firstPoint[1]});
                            
                            scanMarkers.push(
                                <Popup
                                    key="scan-count-popup"
                                    longitude={popupCoords.lng}
                                    latitude={popupCoords.lat}
                                    anchor="top"
                                    offset={15}
                                    className="scan-count-popup"
                                >
                                    <div className="bg-galaxy-purple p-2 rounded-lg border border-light-purple text-white">
                                        <strong>{scanPoints.length} points</strong> Detected!
                                    </div>
                                </Popup>
                            );
                        }
                        
                        return scanMarkers;
                    })()}

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
                
                <div className = "absolute top-0 w-full flex items-end flex-col pointer-events-none">
                    <Warnings />
                </div>
                
                {/* Scan Button - repositioned to bottom left above zoom controls */}
                <div className="absolute bottom-32 left-6 z-10">
                    <PrimaryButton
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent event bubbling
                            e.preventDefault(); // Prevent default behavior
                            console.log("Button clicked - starting scan request");
                            handleScanToggle();
                        }}
                        className={`p-2 ${isScanActive ? 'bg-green-500' : 'bg-red-500'} text-white rounded-full`}
                        disabled={isScanActive} // Disable button while scan is active
                    >
                        {isScanActive ? 'Ongoing scan' : 'Start Scan'}
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};

export default BasicMap;
