"use client"

import EvDetails from "@/app/components/map-page/control-panel/ev-details/EvDetails";
import EditPin from "@/app/components/map-page/control-panel/pin-details/EditPin";
import SelectPin from "@/app/components/map-page/control-panel/pin-details/SelectPin"
import {AddTag} from "@/app/components/map-page/control-panel/pin-details/description/AddTag";
import {AddVoiceNote} from "@/app/components/map-page/control-panel/pin-details/description/AddVoiceNote";
import {PoiStore} from "@/app/hooks/PoiStore";
import React, {RefObject, useRef, useState} from "react";

type ControlPanelProps = {
    state: string;
    panelState: (panel: "EvDetails" | "AddPin" | "SelectPin" | "AddTag" | "AddVoiceNote") => void;
    selectedMarkerRef: React.RefObject<mapboxgl.Marker | null>;
}

export const ControlPanel = ({state, panelState, selectedMarkerRef}: ControlPanelProps ) => {
    const {pois, selectedPoiId, selectPoi, addPoi, updatePoi} = PoiStore();
    const selectedPoi = pois.find(poi => poi.id === selectedPoiId);

    console.log(selectedPoi);

    const handleClose = () => {
        // Close popup if exists
        selectedMarkerRef.current?.getPopup()?.remove();

        // Reset marker icon
        if (selectedMarkerRef.current) {
            selectedMarkerRef.current.getElement().style.backgroundImage = 'url(/markers/default-poi.svg)';
            selectedMarkerRef.current = null;
        }

        // Clear selected POI and go back
        selectPoi(null);
        panelState("EvDetails");
    };

    function handleContent(state: string) {
        switch (state) {
            case "EvDetails":
                return <EvDetails/>;
            case "AddPin":
                return selectedPoi ? (
                    <EditPin
                        poi={selectedPoi}
                        onClose={handleClose}
                        selectedMarkerRef={selectedMarkerRef}
                        setControlPanelState={panelState}
                    />
                ) : null;
            case "SelectPin":
                return selectedPoi ? (
                    <SelectPin
                        poi={selectedPoi}
                        onClose={handleClose}
                        selectedMarkerRef={selectedMarkerRef}
                        setControlPanelState={panelState}
                    />
                ): null;
            case "AddTag":
                return <AddTag
                    onClose={handleClose}
                    setControlPanelState={panelState}
                />
            case "AddVoiceNote":
                return <AddVoiceNote
                    onClose={handleClose}
                    setControlPanelState={panelState}
                />
        }
    }

    return(
        <div className={"h-full transition-opacity duration-300 ease-in-out"}>
            {/*{handleContent(state)}*/}
            {handleContent(state)}
        </div>
    );
}

export default ControlPanel;