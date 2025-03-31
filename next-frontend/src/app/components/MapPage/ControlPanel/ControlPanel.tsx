"use client"

import EvDetails from "@/app/components/MapPage/ControlPanel/EvDetails/EvDetails";
import AddPin from "@/app/components/MapPage/ControlPanel/PinDetails/AddPin";
import SelectPin from "@/app/components/MapPage/ControlPanel/PinDetails/SelectPin"
import SelectStation from "@/app/components/MapPage/ControlPanel/PinDetails/SelectStation"
import {PoiStore} from "@/app/hooks/PoiStore";
import React, {useRef, useState} from "react";

type ControlPanelProps = {
    state: string;
    setControlPanelState: (state: "EvDetails" | "AddPin" | "SelectPin" |"SelectStation") => void;
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
                return selectedPoi ? <AddPin pin={selectedPoi} onClose={handleClose}/> : null;
            case "SelectPin":
                return <SelectPin/>;
            case "SelectStation":
                return <SelectStation/>;
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