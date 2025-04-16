import {Poi, PoiStore} from "@/app/hooks/PoiStore";
import {SecondaryButton} from "@/app/components/ui/ui-buttons/SecondaryButton";
import mapboxgl from "mapbox-gl";
import PrimaryButton from "@/app/components/ui/ui-buttons/PrimaryButton";
import React, {useState} from "react";
import CloseButton from "@/app/components/ui/ui-buttons/CloseButton";
import RecordingCard from "@/app/components/ui/Cards/RecordingCard";

type AddPinProps = {
    pin: Poi;
    onClose: () => void;
    popupRef: React.RefObject<mapboxgl.Popup | null>;
    markerRef: React.RefObject<HTMLElement | null>;
    setControlPanelState: (state: "AddTag" |"AddVoiceNote" | "EvDetails") => void;
}

export const EditPin = ({pin, onClose, markerRef, popupRef, setControlPanelState}: AddPinProps) => {
    const [showInput, setShowInput] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState(pin.name);
    const [savedText, setSavedText] = useState<string>(pin.name);

    const {clearTags, deletePoi} = PoiStore();

    const handleSave = () => {
        pin.name = inputValue;

        popupRef.current?.setHTML(`${pin.name}`);

        setSavedText(inputValue);
        setInputValue(pin.name);
        setShowInput(false);

        setControlPanelState("EvDetails");
    }

    const deletePin = () => {
        deletePoi(pin.id);
        markerRef.current?.remove();
        popupRef.current?.remove();

        setControlPanelState("EvDetails");
    }

    return (
        <div className={"flex flex-col justify-between h-full"}>
            <div className={"flex flex-col gap-10"}>
                {/*Header*/}
                <div className={"flex items-center justify-between"}>
                    {/*Handle user input*/}
                    <div className={"flex text-2xl font-medium gap-2 items-center"}>
                        {!showInput && (
                            <>
                                <button className={"underline"} onClick={() => setShowInput(true)}>Edit</button>
                                <p>{savedText}</p>
                            </>
                        )}

                        {showInput && (
                            <div>
                                <input
                                    type={"text"}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className={"flex items-center rounded-lg bg-white-10 w-full"}/>
                            </div>
                        )}

                        <p className={"text-sm"}>({pin.coords.lat.toFixed(4)}, {pin.coords.lng.toFixed(4)})</p>
                    </div>
                    {/*Close button*/}
                    <CloseButton onClose={onClose}/>
                </div>

                {/*Tag*/}
                <div className={"flex flex-col gap-4"}>
                    <p className={"text-2xl font-bold"}>Tags</p>

                    {(!pin.tags || Object.keys(pin.tags).length === 0) ? (
                        <SecondaryButton
                            logo={"/logo/add.svg"}
                            onClick={() => setControlPanelState("AddTag")}
                        >
                            Tag
                        </SecondaryButton>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {/* selected tag UI */}
                            <div className="flex gap-2">
                                {/* remove tags*/}
                                <button onClick={() => clearTags(pin.id)}>
                                    <img src="/logo/close.svg" alt="clear tags"/>
                                </button>

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

                            <SecondaryButton
                                logo={"/logo/edit.svg"}
                                onClick={() => setControlPanelState("AddTag")}
                            >
                                Edit
                            </SecondaryButton>
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

export default EditPin;