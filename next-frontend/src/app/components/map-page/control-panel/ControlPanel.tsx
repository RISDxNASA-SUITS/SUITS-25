"use client"

import EvDetails from "@/app/components/map-page/control-panel/ev-details/EvDetails";
import AddPin from "@/app/components/map-page/control-panel/pin-details/AddPin";
import SelectPin from "@/app/components/map-page/control-panel/pin-details/SelectPin"
import SelectStation from "@/app/components/map-page/control-panel/pin-details/SelectStation"
import {PoiStore} from "@/app/hooks/PoiStore";
import React, {useRef, useState} from "react";
import {SelectLabel} from "@/app/components/map-page/control-panel/pin-details/SelectLabel";

type ControlPanelProps = {
    state: string;
    setControlPanelState: (state: "EvDetails" | "AddPin" | "SelectPin" |"SelectStation" | "AddTag") => void;
    selectedMarkerPopupRef: React.RefObject<mapboxgl.Popup | null>;
    selectedMarkerElementRef: React.RefObject<HTMLElement | null>;
}

export const ControlPanel = ({state, setControlPanelState, selectedMarkerPopupRef, selectedMarkerElementRef}: ControlPanelProps ) => {
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
        setControlPanelState("EvDetails");
    };

    function handleContent(state: string) {
        switch (state) {
            case "EvDetails":
                return <EvDetails/>;
            case "AddPin":
                return selectedPoi ? (
                    <AddPin
                        pin={selectedPoi}
                        onClose={handleClose}
                        popupRef={selectedMarkerPopupRef}
                        setControlPanelState={setControlPanelState}
                    />
                ) : null;
            case "SelectPin":
                return <SelectPin/>;
            case "SelectStation":
                return <SelectStation/>;
            case "AddTag":
                return <SelectLabel
                    onClose={handleClose}
                    setControlPanelState={setControlPanelState}
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