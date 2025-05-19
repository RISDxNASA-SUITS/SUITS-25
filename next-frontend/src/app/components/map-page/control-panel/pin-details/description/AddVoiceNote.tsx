// import CloseButton from "@/app/components/ui/ui-buttons/CloseButton";
// import SubTabButton from "@/app/components/ui/Tabs/SubTabButton";
// import {useRef, useState, useEffect} from "react";
// import {PoiStore} from "@/app/hooks/PoiStore";
// import PrimaryButton from "@/app/components/ui/ui-buttons/PrimaryButton";
// import {SecondaryButton} from "@/app/components/ui/ui-buttons/SecondaryButton";
// import RecordingCard from "@/app/components/ui/Cards/RecordingCard";
// import useAudioStore from "@/app/hooks/VoiceNoteStore"
// // import { useAudioRecorder } from "react-use-audio-recorder";

// type SelectLabelProps = {
//     onClose: () => void;
//     setControlPanelState: (state:"AddPin") => void;
// }

// export const AddVoiceNote = ({ onClose, setControlPanelState } : SelectLabelProps) => {
//     const { updatePoi, selectedPoiId, pois, hazardPois, updateHazardPoi, addVoiceNote } = PoiStore();
//     const [inputValue, setInputValue] = useState("");
//     const [showInput, setShowInput] = useState(false);
//     const selectedPoi = pois.find(p => p.id === selectedPoiId);
//     const hazardPoi = hazardPois.find(p => p.id === selectedPoiId);
    

//     // const {
//     //     recordingStatus,
//     //     recordingTime,
//     //     startRecording,
//     //     stopRecording,
//     //     pauseRecording,
//     //     resumeRecording,
//     //     getBlob,
//     //     saveRecording,
//     //   } = useAudioRecorder();

//     const formatTime = (seconds: number) => {
//         const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
//         const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
//         const secs = String(seconds % 60).padStart(2, '0');
//         return `${hrs}:${mins}:${secs}`;
//     };
//     const handleStopRecording = async (blob: Blob | undefined, blobURL: string | undefined) => {
//         if (!blob) return;
        
//         const formData = new FormData();
//         formData.append('audio', blob, 'recording.wav');
        
//         try {
//             const response = await fetch(`http://${process.env.NEXT_PUBLIC_JAVA_IP}/audio`, {
//                 method: 'POST',
//                 body: formData
//             });
            
//             if (!response.ok) {
//                 throw new Error('Failed to upload audio');
//             }
            
//             const audioData = await response.json();
//             console.log('Audio uploaded successfully:', audioData);
            
//             if(selectedPoiId){
//                 addVoiceNote(parseInt(selectedPoiId), audioData.id);
//             }
//         } catch (error) {
//             console.error('Error uploading audio:', error);
//         }
//     }

//     return (
//         <div className={"flex flex-col justify-between h-full"}>
//             <div className={"flex flex-col gap-9"}>
//                 <div className={"flex justify-between"}>
//                     <div className={"flex gap-4"}>
//                         <button onClick={() => setControlPanelState("AddPin")}>
//                             <img src={"/logo/back.svg"} alt={"back button"}/>
//                         </button>
//                         <p className={"font-bold text-xl"}>Record Note</p>
//                     </div>
//                     <CloseButton onClose={onClose}/>
//                         </div>

//                     {/* Recording */}
//                     <div className="flex flex-col gap-8">
//                         {(recordingStatus === "recording") ? (
//                         // while recording
//                         <div className={"flex flex-col gap-4 items-center w-full"}>
//                             <div className={"w-full max-w-[500px] flex flex-col px-9 py-9 gap-5 border-light-purple border rounded-2xl"}>
//                                 <button onClick={() => stopRecording(handleStopRecording)} className="flex justify-center">
//                                     <img src={"/logo/pause.svg"} alt={"pause logo"} className="cursor-pointer w-20 h-20" />
//                                 </button>
//                                 <div className={"flex gap-2 items-center justify-center"}>
//                                     <img src={"/logo/sound.svg"} alt={"sound logo"} />
//                                     {recordingTime}
//                                 </div>
//                             </div>
//                         </div>

//                         ) : recordingStatus === "stopped" ? (
//                             // After recording finished
//                             <div className="flex flex-col gap-4 items-center w-full">
//                                 <div className="w-full max-w-[500px] px-9 py-9 flex flex-col gap-5 border-light-purple border rounded-2xl">
//                                     <p className="text-center text-xl font-bold">Record Finished</p>
                        
//                                     {/* Editable Title */}
//                                         <input
//                                             type="text"
//                                             value={inputValue}
//                                             onChange={(e) => setInputValue(e.target.value)}
//                                             onBlur={() => setShowInput(false)}
//                                             className="rounded-lg bg-white-10 px-3 py-1 text-center border border-gray-300"
//                                             autoFocus
//                                         />

//                                     {/* Duration */}
//                                     <div className="flex items-center justify-center gap-2">
//                                         <img src="/logo/sound.svg" className="w-5 h-5"></img>
//                                         {recordingTime}
//                                     </div>
//                                 </div>
                        
//                                 {/* Redo button */}
//                                 <SecondaryButton onClick={startRecording}>
//                                     <img src="/logo/redo_purple.svg" alt="redo icon" className="w-4 h-4 mr-2" />
//                                     Redo
//                                 </SecondaryButton>
//                             </div>

//                         ) : (
//                             //before recording
//                             <div className={"flex flex-col gap-4 items-center w-full"}>
//                                 <div className={"w-full max-w-[500px] flex flex-col px-9 py-9 gap-5 border-light-purple border rounded-2xl"}>
//                                     <button onClick={startRecording} className="flex justify-center">
//                                         <img src={"/logo/microphone.svg"} alt={"start logo"} className="cursor-pointer w-20 h-20 transition-transform" />
//                                     </button>
//                                     <div className={"flex gap-2 items-center justify-center"}>
//                                         <img src={"/logo/sound.svg"} alt={"sound logo"} />
//                                         {formatTime(0)}
//                                     </div>
//                                 </div>
//                             </div>
//                     )}
//                 </div>

//             </div>

//             <div className={"flex"}>
//             <PrimaryButton logo={"/logo/checkmark.svg"} onClick={() => setControlPanelState("AddPin")}>Save</PrimaryButton>
//             </div>
//         </div>
//     );
// };

export const AddVoiceNote = () => {
    return <div> hello</div>
}