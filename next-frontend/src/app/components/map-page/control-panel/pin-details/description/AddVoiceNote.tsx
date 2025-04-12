import CloseButton from "@/app/components/ui/ui-buttons/CloseButton";
import SubTabButton from "@/app/components/ui/Tabs/SubTabButton";
import {useRef, useState} from "react";
import {PoiStore} from "@/app/hooks/PoiStore";
import PrimaryButton from "@/app/components/ui/ui-buttons/PrimaryButton";
import {SecondaryButton} from "@/app/components/ui/ui-buttons/SecondaryButton";
import RecordingCard from "@/app/components/ui/Cards/RecordingCard";

type SelectLabelProps = {
    onClose: () => void;
    setControlPanelState: (state:"AddPin") => void;
}

export const AddVoiceNote = ({ onClose, setControlPanelState } : SelectLabelProps) => {
    const { selectedPoiId, pois, updateTag } = PoiStore();
    const selectedPoi = pois.find(p => p.id === selectedPoiId);

    const [recording, setRecording] = useState<boolean>(false);
    const [audioURL, setAudioURL] = useState("");
    const [elapsedTime, setElapsedTime] = useState(0); // 초 단위 시간 저장

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<number | undefined>(undefined);


    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, {
                type: "audio/webm",
            });
            const url = URL.createObjectURL(audioBlob);
            setAudioURL(url);
            audioChunksRef.current = [];
            setElapsedTime(0); // 리셋
            clearInterval(timerRef.current);
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
                            //while recording
                            <div className={"flex flex-col gap-4 items-center"}>
                                <div className={"flex flex-col px-9 py-9 gap-5 border-light-purple border rounded-2xl "}>
                                    <img src={"/logo/pause.svg"} alt={"pause logo"}/>
                                    <div className={"flex gap-2 items-center"}>
                                        <img src={"/logo/sound.svg"} alt={"sound logo"}/>
                                        {formatTime(elapsedTime)}
                                    </div>
                                </div>
                                <SecondaryButton onClick={() => stopRecording()}>Stop</SecondaryButton>
                            </div>
                        ) : audioURL ? (
                            // After recording finished
                              <div className="flex flex-col gap-4 items-center w-full">
                              <div className="w-full max-w-[500px] px-9 py-9 gap-5 border-light-purple border rounded-2xl">
                                <p className="text-center text-sm font-bold">Record Finished</p>
                                <audio controls src={audioURL} className="w-full" />
                              </div>
                            </div>
                        ) : (
                            //before restarting
                            <SecondaryButton onClick={() => startRecording()}>Start</SecondaryButton>
                    )}
                </div>

            </div>

            <div className={"flex"}>
            <PrimaryButton logo={"/logo/checkmark.svg"} onClick={() => setControlPanelState("AddPin")}>Save</PrimaryButton>
            </div>
        </div>
    );
};