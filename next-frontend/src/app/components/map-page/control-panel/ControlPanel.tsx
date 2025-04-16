"use client"

import EvDetails from "@/app/components/map-page/control-panel/ev-details/EvDetails";
import EditPin from "@/app/components/map-page/control-panel/pin-details/EditPin";
import SelectPin from "@/app/components/map-page/control-panel/pin-details/SelectPin"
import SelectStation from "@/app/components/map-page/control-panel/pin-details/SelectStation"
import {AddTag} from "@/app/components/map-page/control-panel/pin-details/description/AddTag";
import {AddVoiceNote} from "@/app/components/map-page/control-panel/pin-details/description/AddVoiceNote";
import {PoiStore} from "@/app/hooks/PoiStore";
import React, {useRef, useState} from "react";

type ControlPanelProps = {
    state: string;
    panelState: (panel: "EvDetails" | "AddPin" | "SelectPin" |"SelectStation" | "AddTag" | "AddVoiceNote") => void;
    selectedMarkerPopupRef: React.RefObject<mapboxgl.Popup | null>;
    selectedMarkerElementRef: React.RefObject<HTMLElement | null>;
}

export const ControlPanel = ({state, panelState, selectedMarkerPopupRef, selectedMarkerElementRef}: ControlPanelProps ) => {
    const {pois, selectedPoiId, selectPoi, addPoi, updatePoi} = PoiStore();
    const selectedPoi = pois.find(poi => poi.id === selectedPoiId);

    const handleClose = () => {
        // Close popup if exists
        selectedMarkerPopupRef.current?.remove();
        selectedMarkerPopupRef.current = null;

        // Reset marker icon
        if (selectedMarkerElementRef.current) {
            selectedMarkerElementRef.current.style.backgroundImage = 'url(/markers/default-poi.svg)';
            selectedMarkerElementRef.current = null;
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
                        pin={selectedPoi}
                        onClose={handleClose}
                        markerRef={selectedMarkerElementRef}
                        popupRef={selectedMarkerPopupRef}
                        setControlPanelState={panelState}
                    />
                ) : null;
            case "SelectPin":
                return selectedPoi ? (
                    <SelectPin
                        pin={selectedPoi}
                        onClose={handleClose}
                        markerRef={selectedMarkerElementRef}
                        popupRef={selectedMarkerPopupRef}
                        setControlPanelState={panelState}
                    />
                ): null;
            case "SelectStation":
                return <SelectStation/>;
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