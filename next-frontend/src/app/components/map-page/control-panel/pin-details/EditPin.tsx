import {Poi, PoiStore} from "@/app/hooks/PoiStore";
import {SecondaryButton} from "@/app/components/ui/ui-buttons/SecondaryButton";
import mapboxgl from "mapbox-gl";
import PrimaryButton from "@/app/components/ui/ui-buttons/PrimaryButton";
import React, {RefObject, useState, useRef} from "react";
import CloseButton from "@/app/components/ui/ui-buttons/CloseButton";
import RecordingCard from "@/app/components/ui/Cards/RecordingCard";
import NotePreview from "@/app/components/ui/Cards/NotePreview";
import useAudioStore from "@/app/hooks/VoiceNoteStore";

type AddpoiProps = {
    poi: Poi;
    onClose: () => void;
    selectedMarkerRef: RefObject<mapboxgl.Marker | null>;
    setControlPanelState: (state: "AddTag" |"AddVoiceNote" | "EvDetails") => void;
}

export const Editpoi = ({poi, onClose, selectedMarkerRef, setControlPanelState}: AddpoiProps) => {
    const [showInput, setShowInput] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState(poi.name);
    const [savedText, setSavedText] = useState<string>(poi.name);

    const { recordings } = useAudioStore();

    const {updatePoi, clearTags, deletePoi} = PoiStore();

    const handleSave = () => {
        poi.name = inputValue;

        selectedMarkerRef.current?.getPopup()?.setHTML(`${poi.name}`);

        if (selectedMarkerRef.current) {
            selectedMarkerRef.current.getElement().style.backgroundImage = 'url(/markers/default-poi.svg)';
            selectedMarkerRef.current?.getPopup()?.remove();
            selectedMarkerRef.current = null;
        }
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
                        {!showInput && (
                            <>
                                <button className={"underline"} onClick={() => setShowInput(true)}>Edit</button>
                                <p>{poi.name}</p>
                            </>
                        )}

                        {showInput && (
                            <div>
                                <input
                                    type={"text"}
                                    value={inputValue}
                                    onChange={(e) => {
                                        setInputValue(e.target.value)
                                        updatePoi(poi.id, {name: poi.name});
                                    }}
                                    className={"flex items-center rounded-lg bg-white-10 w-full"}/>
                            </div>
                        )}

                        <p className={"text-sm"}>({poi.coords.lat.toFixed(4)}, {poi.coords.lng.toFixed(4)})</p>
                    </div>
                    {/*Close button*/}
                    <CloseButton onClose={onClose}/>
                </div>

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

                {/*Voice Notes*/}
                <div className={"flex flex-col gap-4"}>
                    <p className={"text-2xl font-bold"}>Voice Notes</p>

                    {/* map all recordings from zustand store to the notePreview card */}
                    {recordings.map(item => (
                        <NotePreview date={item.date} title={item.name} key={item.id}></NotePreview>
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

export default Editpoi;