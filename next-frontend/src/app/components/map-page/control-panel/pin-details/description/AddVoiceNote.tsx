import CloseButton from "@/app/components/ui/ui-buttons/CloseButton";
import SubTabButton from "@/app/components/ui/Tabs/SubTabButton";
import {useRef, useState, useEffect} from "react";
import {PoiStore} from "@/app/hooks/PoiStore";
import PrimaryButton from "@/app/components/ui/ui-buttons/PrimaryButton";
import {SecondaryButton} from "@/app/components/ui/ui-buttons/SecondaryButton";
import RecordingCard from "@/app/components/ui/Cards/RecordingCard";
import useAudioStore from "@/app/hooks/VoiceNoteStore"

type SelectLabelProps = {
    onClose: () => void;
    setControlPanelState: (state:"AddPin") => void;
}

export const AddVoiceNote = ({ onClose, setControlPanelState } : SelectLabelProps) => {
    const { updatePoi, selectedPoiId, pois, updateTag } = PoiStore();
    const selectedPoi = pois.find(p => p.id === selectedPoiId);


    const [recording, setRecording] = useState<boolean>(false);
    const [audioURL, setAudioURL] = useState("");
    const [elapsedTime, setElapsedTime] = useState(1);
    const noteCount = useRef<number>(0);
    const [inputValue, setInputValue] = useState("Voice Note " + noteCount.current);
    const [showInput, setShowInput] = useState(false);
    const savedText = inputValue;

    const { addRecording } = useAudioStore();

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<number | undefined>(undefined);
    
    const { recordings } = useAudioStore();

    //update noteCount ref to the most recent recording id when new recording is saved to the store
    useEffect(()=>{
        //if there is an existing recording, update the noteCount ref to the latest count
        if (recordings && recordings.length >= 1) {
            const latestId = Math.max(...recordings.map(rec => rec.id));
            noteCount.current = latestId;
        }
        console.log(noteCount.current);
    },[recordings]);

    const startRecording = async () => {
        console.log(noteCount.current);

        //increment the recording count
        noteCount.current ++;
        console.log(noteCount.current);
        setInputValue("Voice Note " + noteCount.current);

        setElapsedTime(0);

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
            saveRecording();
        };

        mediaRecorderRef.current.start();
        setRecording(true);

        //start timer
        timerRef.current = window.setInterval(() => {
            setElapsedTime((prev) => prev + 1);
        }, 1000);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const saveRecording = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        const newRecording = {
            id: noteCount.current,
            audioUrl: url,
            time: formatTime(elapsedTime),
            date: `${new Date().toString()}`,
            name: "Voice Note " + noteCount.current,

            //save the id of the poi the note was for
            poiID: selectedPoiId
        }

        //save recording to the voice note store
        addRecording(newRecording);

        //update the list of recording IDs for this poi
        if (selectedPoiId){

            const poiRecordings = selectedPoi?.voiceNoteID || [];

            updatePoi(selectedPoiId, { 
                voiceNoteID: [...poiRecordings, newRecording.id] 
            });
        }

        audioChunksRef.current = [];
        clearInterval(timerRef.current);
    };

    const formatTime = (seconds: number) => {
        const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        return `${hrs}:${mins}:${secs}`;
    };

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

                    {/* Recording */}
                    <div className="flex flex-col gap-8">
                        {(recording) ? (
                        // while recording
                        <div className={"flex flex-col gap-4 items-center w-full"}>
                            <div className={"w-full max-w-[500px] flex flex-col px-9 py-9 gap-5 border-light-purple border rounded-2xl"}>
                                <button onClick={stopRecording} className="flex justify-center">
                                    <img src={"/logo/pause.svg"} alt={"pause logo"} className="cursor-pointer w-20 h-20" />
                                </button>
                                <div className={"flex gap-2 items-center justify-center"}>
                                    <img src={"/logo/sound.svg"} alt={"sound logo"} />
                                    {formatTime(elapsedTime)}
                                </div>
                            </div>
                        </div>

                        ) : audioURL ? (
                            // After recording finished
                            <div className="flex flex-col gap-4 items-center w-full">
                                <div className="w-full max-w-[500px] px-9 py-9 flex flex-col gap-5 border-light-purple border rounded-2xl">
                                    <p className="text-center text-xl font-bold">Record Finished</p>
                        
                                    {/* Editable Title */}
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onBlur={() => setShowInput(false)}
                                            className="rounded-lg bg-white-10 px-3 py-1 text-center border border-gray-300"
                                            autoFocus
                                        />

                                    {/* Duration */}
                                    <div className="flex items-center justify-center gap-2">
                                        <img src="/logo/sound.svg" className="w-5 h-5"></img>
                                        {formatTime(elapsedTime)}
                                    </div>
                                </div>
                        
                                {/* Redo button */}
                                <SecondaryButton onClick={() => startRecording()}>
                                    <img src="/logo/redo_purple.svg" alt="redo icon" className="w-4 h-4 mr-2" />
                                    Redo
                                </SecondaryButton>
                            </div>

                        ) : (
                            //before recording
                            <div className={"flex flex-col gap-4 items-center w-full"}>
                                <div className={"w-full max-w-[500px] flex flex-col px-9 py-9 gap-5 border-light-purple border rounded-2xl"}>
                                    <button onClick={startRecording} className="flex justify-center">
                                        <img src={"/logo/microphone.svg"} alt={"start logo"} className="cursor-pointer w-20 h-20 transition-transform" />
                                    </button>
                                    <div className={"flex gap-2 items-center justify-center"}>
                                        <img src={"/logo/sound.svg"} alt={"sound logo"} />
                                        {formatTime(0)}
                                    </div>
                                </div>
                            </div>
                    )}
                </div>

            </div>

            <div className={"flex"}>
            <PrimaryButton logo={"/logo/checkmark.svg"} onClick={() => setControlPanelState("AddPin")}>Save</PrimaryButton>
            </div>
        </div>
    );
};