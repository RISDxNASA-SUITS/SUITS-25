"use client"

import BasicMap from "@/app/components/map-page/map/BasicMap";
import ControlPanel from "@/app/components/map-page/control-panel/ControlPanel";
import MissionInfoPanel from "@/app/components/map-page/mission-info/MissionInfoPanel"
import {useEffect, useRef, useState} from "react";

type ControlPanelState = "EvDetails" | "AddPin" | "SelectPin" | "AddTag" | "AddVoiceNote" | "AddHazard" | "SelectHazard"

export const MapPage = ()=>{
    const [controlPanelState, setControlPanelState] = useState<ControlPanelState>("EvDetails")

    const selectedMarkerRef = useRef<mapboxgl.Marker | null>(null);
    
    //rover coords
    const [roverX,setRoverX] = useState<number>(0);
    const [roverY, setRoverY] = useState<number>(0);
    
    console.log(controlPanelState);
    
    useEffect(() => {
        console.log(roverX, roverY);
        const fetchRoverCoords = async() => {
            try {
                const data = await fetch('/api/map-page-stats');
                if (!data.ok) {
                    throw new Error("HTTP error: " + data.statusText);
                }
                const res = await data.json();
                
                // console.log(res.x, res.y);
                
                setRoverX(res.x || -95.08100506531964);
                setRoverY(res.y || 29.56485541847833);
                
            } catch (err) {
                console.error('Error fetching rover coords data', err);
            }
        }
        
        fetchRoverCoords();
        
        const interval = setInterval(fetchRoverCoords, 1000);
        return () => clearInterval(interval);
    }, [roverX, roverY]);

    return (
        <div className="flex w-full h-screen bg-slate-800">
            <div className="w-1/4 bg-midnight-purple flex flex-col gap-2 p-4 border-r-2 border-white border-opacity-10">
                <ControlPanel
                    state={controlPanelState}
                    panelState={setControlPanelState}
                    selectedMarkerRef={selectedMarkerRef}
                />
            </div>

            <div className="flex flex-col bg-midnight-purple w-3/4">
                <MissionInfoPanel/>

                <BasicMap
                    roverCoords={{x: roverX, y: roverY}}
                    setControlPanelState={setControlPanelState}
                    selectedMarkerRef={selectedMarkerRef}
                />
            </div>
        </div>
    )
}