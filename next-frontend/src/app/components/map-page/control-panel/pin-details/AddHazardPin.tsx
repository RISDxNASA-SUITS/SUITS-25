import {Poi, PoiStore, HazardPoi} from "@/app/hooks/PoiStore";
import {SecondaryButton} from "@/app/components/ui/ui-buttons/SecondaryButton";
import mapboxgl from "mapbox-gl";
import PrimaryButton from "@/app/components/ui/ui-buttons/PrimaryButton";
import React, {RefObject, useState, useRef} from "react";
import CloseButton from "@/app/components/ui/ui-buttons/CloseButton";
import RecordingCard from "@/app/components/ui/Cards/RecordingCard";
import NotePreview from "@/app/components/ui/Cards/NotePreview";
import useAudioStore from "@/app/hooks/VoiceNoteStore";
import { usePanelStore } from "@/app/hooks/panelStore";
import {AddTag} from "@/app/components/map-page/control-panel/pin-details/description/AddTag";
import AudioCard from "@/app/components/ui/Cards/AudioCard"

type AddpoiProps = {
    poi: Poi;
    onClose: () => void;
    selectedMarkerRef: RefObject<mapboxgl.Marker | null>;
    setControlPanelState: (state: "AddTag" |"AddVoiceNote" | "EvDetails") => void;
}

export const AddHazardPin = ({poi, onClose, selectedMarkerRef, setControlPanelState}: AddpoiProps) => {
    const [showInput, setShowInput] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState(poi.name);
    const [savedText, setSavedText] = useState<string>(poi.name);
    
    //initial input field value
    const [initialInputValue, setInitialInputValue] = useState(poi.name);
    //initial input field state
    const [showField, setShowField] = useState<boolean>(true);
    
    // Type check and cast
    const isHazardPoi = poi.type === 'hazard';
    const hazardPoi = isHazardPoi ? poi as HazardPoi : null;

    const { updatePoi, deletePoi, selectedPoiId, pois, addVoiceNote} = PoiStore();
    const {setPanelState} = usePanelStore();

    //voice note IDs from currently selected POI
    // const recordingIDs = poi.voiceNoteID;
    
    // // all recordings from the AudioStore
    // const { recordings } = useAudioStore();
    
    
    const handleSave = () => {
       
        updatePoi(poi)
        
       
        setSavedText(inputValue);
        setInputValue(poi.name);
        setShowInput(false);
        
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
                    <div className={"flex text-2xl font-medium gap-2 items-center"}>
                        {!showInput && (
                            <>
                                <p>Edit</p>
                                <p>{poi.name}</p>
                            </>
                        )}
                        
                        <p className={"text-sm"}>({poi.coords.lat.toFixed(4)}, {poi.coords.lng.toFixed(4)})</p>
                    </div>
                    {/*Close button*/}
                    <CloseButton onClose={onClose}/>
                </div>
                
                {/* Initial title input field */}
                {showField && (
                    <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value)
                    }}
                    onBlur={() => {
                        poi.name = inputValue
                        updatePoi(poi)
                    }}
                    className="rounded-lg bg-white-10 px-3 py-1 text-center border border-gray-300"
                    autoFocus
                    />
                )}
                
                {/*Tag*/}
                <div className={"flex flex-col gap-4"}>
                <AddTag compact={true}>

                </AddTag>
                </div>

                
                
                {/*Voice Notes*/}
                <div className={"flex flex-col gap-4"}>
                    <p className={"text-2xl font-bold"}>Voice Notes</p>
                    {poi.audioId === null ? <SecondaryButton logo={"/logo/add.svg"} onClick={() => setPanelState("AddVoiceNote")}
                    >Voice Note</SecondaryButton> : <AudioCard audio_src = {"/api/audio?audioId=" + String(poi.audioId)} unlinkAudio = {unlinkAudio} redo = {redoAudio}/>}
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

export default AddHazardPin;