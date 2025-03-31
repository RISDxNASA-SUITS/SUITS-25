"use client"

import BasicMap from "@/app/components/MapPage/Map/BasicMap";
import ControlPanel from "@/app/components/MapPage/ControlPanel/ControlPanel";
import MissionInfoPanel from "@/app/components/MapPage/MissionInfo/MissionInfoPanel"
import {useRef, useState} from "react";
import {Marker} from "mapbox-gl";

type MapPageProps = {
    roverCoords: {x: number, y: number}
}


type ControlPanelState = "EvDetails" | "AddPin" | "SelectPin" |"SelectStation"

export const MapPage = ({roverCoords}: MapPageProps)=>{
    const [controlPanelState, setControlPanelState] = useState<ControlPanelState>("EvDetails")

    const selectedMarkerPopupRef = useRef<mapboxgl.Popup | null>(null);
    const selectedMarkerElementRef = useRef<HTMLElement | null>(null);

    return (
        <div className="flex w-full h-screen bg-slate-800">
            <div className="w-1/4 bg-midnight-purple flex flex-col gap-2 p-4 border-r-2 border-white border-opacity-10">
                <ControlPanel
                    state={controlPanelState}
                    setControlPanelState={setControlPanelState}
                    selectedMarkerPopupRef={selectedMarkerPopupRef}
                    selectedMarkerElementRef={selectedMarkerElementRef}
                />
            </div>

            <div className="flex flex-col bg-midnight-purple w-3/4">
                <MissionInfoPanel/>
                <BasicMap
                    roverCoords={roverCoords}
                    setControlPanelState={setControlPanelState}
                    selectedMarkerPopupRef={selectedMarkerPopupRef}
                    selectedMarkerElementRef={selectedMarkerElementRef}
                />
            </div>
        </div>
    )
}