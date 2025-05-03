"use client"

import BasicMap from "@/app/components/map-page/map/BasicMap";
import ControlPanel from "@/app/components/map-page/control-panel/ControlPanel";
import MissionInfoPanel from "@/app/components/map-page/mission-info/MissionInfoPanel"
import {useRef, useState} from "react";
import {SelectedMarkerRefs} from "@/app/components/map-page/SelectedMarkerRefs";

type MapPageProps = {
    roverCoords: {x: number, y: number}
}

type ControlPanelState = "EvDetails" | "AddPin" | "SelectPin" |"SelectStation" | "AddTag" | "AddVoiceNote"

export const MapPage = ({roverCoords}: MapPageProps)=>{
    const [controlPanelState, setControlPanelState] = useState<ControlPanelState>("EvDetails")

    const selectedMarkerRef = useRef<SelectedMarkerRefs>({
        markerElement: null,
        popup: null,
    });


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
                    roverCoords={roverCoords}
                    setControlPanelState={setControlPanelState}
                    selectedMarkerRef={selectedMarkerRef}
                />
            </div>
        </div>
    )
}