import CloseButton from "@/app/components/ui/ui-buttons/CloseButton";
import SubTabButton from "@/app/components/ui/Tabs/SubTabButton";
import {useRef, useState, useEffect} from "react";
import {PoiStore} from "@/app/hooks/PoiStore";
import PrimaryButton from "@/app/components/ui/ui-buttons/PrimaryButton";
import {SecondaryButton} from "@/app/components/ui/ui-buttons/SecondaryButton";
import RecordingCard from "@/app/components/ui/Cards/RecordingCard";
import useAudioStore from "@/app/hooks/VoiceNoteStore"
import { useReactMediaRecorder } from "react-media-recorder";

type SelectLabelProps = {
    onClose: () => void;
    setControlPanelState: (state:"AddPin") => void;
}

export const AddVoiceNote = ({ onClose, setControlPanelState } : SelectLabelProps) => {
    const {selectedPoiId, pois, hazardPois, addVoiceNote} = PoiStore();
    
    const possiblePoi = pois.find(x => x.id === selectedPoiId)
    const possibleHazard = hazardPois.find(x => x.id === selectedPoiId)
    const poi = possiblePoi ?? possibleHazard
    const [audioBlobId, setAudioBlobId] = useState(poi ? poi.audioId : undefined)
    
    const handleStopRecording = async (blobURL: string | undefined, blob: Blob | undefined) => {
        if (!blob) return;
        
        const formData = new FormData();
        formData.append('audio', blob, String(selectedPoiId) + '.wav');
        
        try {
            const response = await fetch('/api/audio', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Failed to upload audio');
            }
            
            const audioData = await response.json();
            console.log('Audio uploaded successfully:', audioData);
            
            if(selectedPoiId){
                addVoiceNote(Number(selectedPoiId), audioData.id);
                setAudioBlobId(audioData.id)
            }
        } catch (error) {
            console.error('Error uploading audio:', error);
        }
    }

    const {status, startRecording, stopRecording, mediaBlobUrl} = useReactMediaRecorder({audio: true, onStop: handleStopRecording})

    const toggleRecording = () => {
        if(status === 'recording'){
            stopRecording()
        }
        else
        {
            startRecording()
        }
    }

    return (
        <div className={"flex flex-col justify-between h-full"}>
            <div className={"flex flex-col gap-9"}>
                <div className={"flex justify-between"}>
                    <div className={"flex gap-4"}>
                        <button onClick={() => setControlPanelState("AddPin")}>
                            <img src={"/logo/back.svg"} alt={"back button"}/>
                        </button>
                        <p className={"font-bold text-xl"}>Record Note</p>
                    </div>
                    <CloseButton onClose={onClose}/>
                </div>

                {/* Handling Recording Toggling */}
                <div className="flex flex-col gap-8">
                    {
                    <div className={"flex flex-col gap-4 items-center w-full"}>
                        <div className={"w-full max-w-[500px] flex flex-col px-9 py-9 gap-5 border-light-purple border rounded-2xl"}>
                            <button onClick={() => toggleRecording()} className="flex justify-center">
                                {(status === 'recording') ? 
                                <img src={"/logo/pause.svg"} alt={"pause logo"} className="cursor-pointer w-20 h-20" />
                                : <img src={"/logo/microphone.svg"} alt={"pause logo"} className="cursor-pointer w-20 h-20" />}
                            </button>
                        </div>
                    </div>
                    }
                </div>
                {(audioBlobId != undefined) ? <audio src = {"/api/audio?audioId=" + audioBlobId} controls></audio> : null}

            </div>

            <div className={"flex"}>
            <PrimaryButton logo={"/logo/checkmark.svg"} onClick={() => setControlPanelState("AddPin")}>Save</PrimaryButton>
            </div>
        </div>
    );
};