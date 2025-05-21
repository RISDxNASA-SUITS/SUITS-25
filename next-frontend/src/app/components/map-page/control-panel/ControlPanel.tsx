"use client"

import EvDetails from "@/app/components/map-page/control-panel/ev-details/EvDetails";
import EditPin from "@/app/components/map-page/control-panel/pin-details/EditPin";
import SelectPin from "@/app/components/map-page/control-panel/pin-details/SelectPin"


import {AddTag} from "@/app/components/map-page/control-panel/pin-details/description/AddTag";
import {AddVoiceNote} from "@/app/components/map-page/control-panel/pin-details/description/AddVoiceNote";
import {PoiStore} from "@/app/hooks/PoiStore";
import React, {RefObject, useRef, useState} from "react";
import AddHazardPin from "@/app/components/map-page/control-panel/pin-details/AddHazardPin";
import SelectHazardPin from "@/app/components/map-page/control-panel/pin-details/SelectHazardPin";
import { usePanelStore } from "@/app/hooks/panelStore";
type ControlPanelProps = {
    state: string;
    panelState: (panel: "EvDetails" | "AddPin" | "SelectPin" | "AddTag" | "AddVoiceNote" | "AddHazard" | "SelectHazard") => void;
    
}

export const ControlPanel = () => {
    const {pois, hazardPois,selectedPoiId, selectPoi, addPoi} = PoiStore();
    const selectedPoi = pois.find(poi => poi.id === selectedPoiId);
    const selectHazardPoi = hazardPois.find(poi => poi.id === selectedPoiId);
    const {panelState, setPanelState, showPopup, setShowPopup} = usePanelStore();

    
    
    
    const handleClose = () => {
        selectPoi(null);
        setPanelState("EvDetails");
    };

    function handleContent(state: string) {
        switch (state) {
            case "EvDetails":
                return <EvDetails
                   
                />;
            case "AddPin":
                return selectedPoi ? (
                    <EditPin
                        poi={selectedPoi}
                        onClose={handleClose}
                    />
                ) : null;
            case "SelectPin":
                return selectedPoi ? (
                    <SelectPin
                        poi={selectedPoi}
                        onClose={handleClose}
                        
                        
                    />
                ): null;
            case "AddTag":
                return <AddTag
                    onClose={handleClose}
                    setControlPanelState={setPanelState}
                />
            case "AddVoiceNote":
                return <AddVoiceNote
                    onClose={handleClose}
                    setControlPanelState={setPanelState}
                />
            case "AddHazard":
                return selectHazardPoi ? (
                    <AddHazardPin
                        poi={selectHazardPoi}
                        onClose={handleClose}
                        
                        setControlPanelState={setPanelState}
                    />
                ) : null;
            case "SelectHazard":
                return selectHazardPoi ? (
                    <SelectHazardPin
                        poi={selectHazardPoi}
                        onClose={handleClose}
                        
                        setControlPanelState={panelState}
                    />
                ) : null;
        }
    }

    return(
        <div className={"h-full transition-opacity duration-300 ease-in-out"}>
            {/*{handleContent(state)}*/}
            {handleContent(panelState)}
        </div>
    );
}

export default ControlPanel;