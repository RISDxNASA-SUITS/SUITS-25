import {Poi, PoiStore} from "@/app/hooks/PoiStore";
import {SecondaryButton} from "@/app/components/ui/ui-buttons/SecondaryButton";
import mapboxgl from "mapbox-gl";
import PrimaryButton from "@/app/components/ui/ui-buttons/PrimaryButton";
import React, {RefObject, useState} from "react";
import CloseButton from "@/app/components/ui/ui-buttons/CloseButton";
import RecordingCard from "@/app/components/ui/Cards/RecordingCard";
import {clearSelectedMarker, SelectedMarkerRefs} from "@/app/components/map-page/SelectedMarkerRefs";

type selectPinProps = {
    pin: Poi;
    onClose: () => void;
    selectedMarkerRef: RefObject<SelectedMarkerRefs>;
    setControlPanelState: (state: "AddTag" |"AddVoiceNote" | "EvDetails") => void;
}

export const SelectPin = ({pin, onClose, selectedMarkerRef, setControlPanelState}: selectPinProps) => {
    const [showInput, setShowInput] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState(pin.name);
    const [savedText, setSavedText] = useState<string>(pin.name);

    const {clearTags, deletePoi} = PoiStore();

    const handleSave = () => {
        pin.name = inputValue;

        selectedMarkerRef.current.popup?.setHTML(`${pin.name}`);

        setSavedText(inputValue);
        setInputValue(pin.name);
        setShowInput(false);

        setControlPanelState("EvDetails");
    }

    const deletePin = () => {
        deletePoi(pin.id);
        clearSelectedMarker(selectedMarkerRef);
        setControlPanelState("EvDetails");
    };

    return (
        <div className={"flex flex-col justify-between h-full"}>
            <div className={"flex flex-col gap-10"}>
                {/*Header*/}
                <div className={"flex items-center justify-between"}>
                    {/*Handle user input*/}
                    <div className={"flex text-2xl font-medium gap-2 items-center"}>
                        <p>{pin.name}</p>
                    </div>
                    {/*Close button*/}
                    <CloseButton onClose={onClose}/>
                </div>

                {/*Tag*/}
                <div className={"flex flex-col gap-4"}>
                    <p className={"text-2xl font-bold"}>Tags</p>

                    {(!pin.tags || Object.keys(pin.tags).length === 0) ? (
                        <></>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {/* selected tag UI */}
                            <div className="flex gap-2">
                                {Object.entries(pin.tags).map(([category, subTags]) => (
                                    <div key={category}
                                         className="w-full bg-white-10 px-4 py-2 rounded-lg flex gap-2 flex-wrap items-center">
                                        <span className="font-bold text-white">{category}</span>
                                        {Object.entries(subTags).flatMap(([sub, labels]) =>
                                            labels.map(label => (
                                                <span
                                                    key={`${sub}-${label}`}
                                                    className="px-4 py-2 rounded-full border border-white text-white text-sm"
                                                >
                                                        {label}
                                                    </span>
                                            ))
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/*Voice Notes*/}
                <div className={"flex flex-col gap-4"}>
                    <p className={"text-2xl font-bold"}>Voice Notes</p>

                    <SecondaryButton logo={"/logo/add.svg"} onClick={() => setControlPanelState("AddVoiceNote")}
                    >Voice Note</SecondaryButton>
                </div>
            </div>

            {/*Buttons*/}
            <div className={"flex justify-between gap-4"}>
                <SecondaryButton logo={"/logo/delete.svg"} onClick={() => deletePin()}>Delete Pin</SecondaryButton>
                <PrimaryButton logo={"/logo/checkmark.svg"} onClick={() => handleSave()}>Save Pin</PrimaryButton>
            </div>
        </div>
    )
}

export default SelectPin;