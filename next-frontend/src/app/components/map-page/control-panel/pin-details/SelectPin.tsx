import {Poi, PoiStore} from "@/app/hooks/PoiStore";
import {SecondaryButton} from "@/app/components/ui/ui-buttons/SecondaryButton";
import PrimaryButton from "@/app/components/ui/ui-buttons/PrimaryButton";
import React, {RefObject, useState} from "react";
import CloseButton from "@/app/components/ui/ui-buttons/CloseButton";
import NotePreview from "@/app/components/ui/Cards/NotePreview";
import {AddTag} from "@/app/components/map-page/control-panel/pin-details/description/AddTag";

type selectpoiProps = {
    poi: Poi;
    onClose: () => void;
    selectedMarkerRef: RefObject<mapboxgl.Marker | null>;
    setControlPanelState: (state: "AddTag" | "EvDetails" | "AddPin" | "SelectPin") => void;
}

export const Selectpoi = ({poi, onClose, selectedMarkerRef, setControlPanelState}: selectpoiProps) => {
    const [showInput, setShowInput] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState(poi.name);
    const [savedText, setSavedText] = useState<string>(poi.name);

    //voice note IDs from currently selected POI
    const recordingIDs = poi.voiceNoteID;

    const {clearTags, deletePoi} = PoiStore();

    const handleSave = () => {
        poi.name = inputValue;

        selectedMarkerRef.current?.getPopup()?.setHTML(`${poi.name}`);

        setSavedText(inputValue);
        setInputValue(poi.name);
        setShowInput(false);

        setControlPanelState("EvDetails");
    }

    const deleteMarker = () => {
        deletePoi(poi.id);
        selectedMarkerRef.current?.remove();
        setControlPanelState("EvDetails");
    };

    return (
        <div className={"flex flex-col justify-between h-full"}>
            <div className={"flex flex-col gap-10"}>
                {/*Header*/}
                <div className={"flex items-center justify-between"}>
                    {/*Handle user input*/}
                    <div className={"flex text-2xl font-medium gap-2 items-center"}>
                        <p>{poi.name}</p>
                    </div>
                    {/*Close button*/}
                    <CloseButton onClose={onClose}/>
                </div>

                {/*Tag*/}
                <div className={"flex flex-col gap-4"}>
                    <p className={"text-2xl font-bold"}>Tags</p>
                    <AddTag onClose={onClose} setControlPanelState={setControlPanelState}compact={true} />
                </div>

                {/*Voice Notes*/}
                <div className={"flex flex-col gap-4"}>
                    <p className={"text-2xl font-bold"}>Voice Notes</p>

                    {/* map all recordings from zustand store to the notePreview card */}
                    {recordingIDs?.map(item => (
                        <NotePreview date="test" title={`${item}`} key={item}></NotePreview>
                    ))}

                    <SecondaryButton logo={"/logo/add.svg"} onClick={() => setControlPanelState("AddVoiceNote")}
                    >Voice Note</SecondaryButton>
                </div>
            </div>

            {/*Buttons*/}
            <div className={"flex justify-between gap-4"}>
                <SecondaryButton logo={"/logo/delete.svg"} onClick={() => deleteMarker()}>Delete poi</SecondaryButton>
                <PrimaryButton logo={"/logo/checkmark.svg"} onClick={() => handleSave()}>Save poi</PrimaryButton>
            </div>
        </div>
    )
}

export default Selectpoi;