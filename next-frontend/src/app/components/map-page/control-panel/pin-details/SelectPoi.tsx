import {Poi, PoiStore} from "@/app/hooks/PoiStore";
import {SecondaryButton} from "@/app/components/ui/ui-buttons/SecondaryButton";
import PrimaryButton from "@/app/components/ui/ui-buttons/PrimaryButton";
import React, {RefObject, useState} from "react";
import CloseButton from "@/app/components/ui/ui-buttons/CloseButton";
import NotePreview from "@/app/components/ui/Cards/NotePreview";
import {AddTag} from "@/app/components/map-page/control-panel/pin-details/description/AddTag";
import { usePanelStore } from "@/app/hooks/panelStore";
import AddWarning from "@/app/components/map-page/control-panel/pin-details/description/AddWarning"
import AudioCard from "@/app/components/ui/Cards/AudioCard"

type selectpoiProps = {
    poi: Poi;
    onClose: () => void;

}

export const Selectpoi = ({poi, onClose}: selectpoiProps) => {
    const [showInput, setShowInput] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState(poi.name);
    const [savedText, setSavedText] = useState<string>(poi.name);
    const {setPanelState} = usePanelStore();
    const {selectedPoiId, pois, hazardPois, addVoiceNote, updatePoi} = PoiStore();

    //voice note IDs from currently selected POI
    const recordingIDs = poi.audioId;

    const { deletePoi} = PoiStore();

    const handleSave = () => {
        poi.name = inputValue;
        updatePoi(poi)
        setInputValue(poi.name);
        setShowInput(false);
        onClose()
        setPanelState("EvDetails");
    }

    const deleteMarker = () => {
        deletePoi(poi.id);
        
        setPanelState("EvDetails");
    };
    const unlinkAudio = () => {
        addVoiceNote(poi.id, undefined);
    }
    const redoAudio = () => {
        setPanelState("AddVoiceNote")
    }
    return (
        <div className={"flex flex-col justify-between h-full"}>
            <div className={"flex flex-col gap-10"}>
                {/*Header*/}
                <div className={"flex items-center justify-between"}>
                    {/*Handle user input*/}
                    <div className={"flex text-2xl font-medium gap-2 items-center w-4/5"}>
                        <p>{poi.name}</p>
                    </div>
                    <div className={"flex text-2xl font-medium gap-2 items-center"}>
                        <button onClick = {() => {setPanelState("AddPin")}}>
                            <img src = "logo/edit.svg"></img>
                        </button>
                    </div>
                    {/*Close button*/}
                    <CloseButton onClose={onClose}/>
                </div>

                {/*Tag*/}
                <div className={"flex flex-col gap-4"}>
                    <p className={"text-2xl font-bold"}>Tags</p>
                    <AddTag onClose={onClose} setControlPanelState={setPanelState}compact={true} />
                </div>

                {/*Voice Notes*/}
                <div className={"flex flex-col gap-4"}>
                    <p className={"text-2xl font-bold"}>Voice Notes</p>
                    {poi.audioId === null ? <SecondaryButton logo={"/logo/add.svg"} onClick={() => setPanelState("AddVoiceNote")}
                    >Voice Note</SecondaryButton> : <AudioCard audio_src = {"/api/audio?audioId=" + String(poi.audioId)} unlinkAudio = {unlinkAudio} redo = {redoAudio}/>}
                </div>
            </div>

            {/*Buttons*/}
            <div className={"flex justify-between flex-col gap-4"}>
                <AddWarning />
                <div className="flex flex-row justify-between gap-4">
                    <SecondaryButton logo={"/logo/delete.svg"} onClick={() => deleteMarker()}>Delete poi</SecondaryButton>
                    <PrimaryButton logo={"/logo/checkmark.svg"} onClick={() => handleSave()}>Save poi</PrimaryButton>
                </div>
            </div>
        </div>
    )
}

export default Selectpoi;