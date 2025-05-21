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
    const [showInitialInput, setInitialShowInput] = useState<boolean>(true);
    
    // Type check and cast
    const isHazardPoi = poi.type === 'hazard';
    const hazardPoi = isHazardPoi ? poi as HazardPoi : null;
    
    const [hazardCategory, setHazardCategory] = useState<'warning' | 'caution'>(
        hazardPoi?.hazardCategory || 'warning'
    );

    const { updatePoi, deletePoi, selectedPoiId, pois } = PoiStore();
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
                {showInitialInput && (
                    <input
                        type="text"
                        value={initialInputValue}
                        onChange={(e) => {
                            setInitialInputValue(e.target.value)
                        }}
                        onBlur={() => {
                            // updatePoi(poi.id, { name: initialInputValue });
                            setInitialShowInput(false);
                        }}
                        className="rounded-lg bg-white-10 px-3 py-1 text-center border border-gray-300"
                        autoFocus
                    />
                )}
                
                {/*Tag*/}
                <div className={"flex flex-col gap-4"}>
                    <p className={"text-2xl font-bold"}>Tags</p>
                    
                    {(!poi.tags || Object.keys(poi.tags).length === 0) ? (
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
                                <button onClick={() => clearTags(poi.id)}>
                                    <img src="/logo/close.svg" alt="clear tags"/>
                                </button>
                                
                                {Object.entries(poi.tags).map(([category, subTags]) => (
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

                {/* Hazard Category */}
                <div className="flex flex-col gap-4">
                    <p className="text-2xl font-bold">Hazard Category</p>
                    <div className="flex gap-2 p-2 rounded-xl bg-white/10">
                        {/* Warning */}
                        <button
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-medium transition-colors duration-200 ${
                                hazardCategory === 'warning'
                                ? 'bg-[#6e223d] border-white text-white'
                                : 'bg-transparent border-white text-white'
                            }`}
                            onClick={() => {
                                setHazardCategory('warning');
                                if (poi.type === 'hazard') {
                                    updateHazardPoi(poi.id, { hazardCategory: 'warning' });
                                }
                            }}
                            >
                            <span
                                className={`w-2 h-2 rounded-full ${
                                hazardCategory === 'warning' ? 'bg-[#ff1a1a]' : 'bg-red-500'
                                }`}
                            ></span>
                            Warning (Default)
                            </button>

                        {/* Caution */}
                        <button
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm transition-colors duration-200 ${
                            hazardCategory === 'caution'
                            ? 'bg-[#5e4331] border-white text-white'
                            : 'bg-transparent border-white text-white'
                        }`}
                        onClick={() => {
                            setHazardCategory('caution');
                            if (poi.type === 'hazard') {
                                updateHazardPoi(poi.id, { hazardCategory: 'caution' });
                            }
                        }}
                        >
                        <span
                            className={`w-2 h-2 rounded-full ${
                            hazardCategory === 'caution' ? 'bg-[#ff9900]' : 'bg-yellow-400'
                            }`}
                        ></span>
                        Caution
                        </button>
                    </div>
                </div>

                
                
                {/*Voice Notes*/}
                <div className={"flex flex-col gap-4"}>
                    <p className={"text-2xl font-bold"}>Voice Notes</p>
                    
                    {/* map all recordings from zustand store to the notePreview card */}
                    {/*{recordingIDs?.map(item => (*/}
                    {/*    <NotePreview date="test" title={`${item}`} key={item}></NotePreview>*/}
                    {/*))}*/}
                    
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

export default AddHazardPin;