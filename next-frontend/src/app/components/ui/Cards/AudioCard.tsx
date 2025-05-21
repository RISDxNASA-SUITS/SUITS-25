import { Poi } from "@/app/hooks/PoiStore";
import { AudioPlayer } from "react-audio-play";
import { usePanelStore, updatePoi} from "@/app/hooks/panelStore";
interface AudioCardProps{
    audio_src:string
    unlinkAudio : (() => void) | undefined
    redo : (() => void) | undefined
}
export const AudioCard = ({audio_src, unlinkAudio = undefined, redo = undefined} : AudioCardProps) => {
    const {setPanelState} = usePanelStore();
    return (
    <div className = "flex w-full">
        <div className = "w-5/6">
            <AudioPlayer
                src={audio_src}
                color="#ffffff"
                sliderColor="#ff669d"
                style={{background: "#100a28",borderRadius: "15px", padding: "30px"}}
            />
        </div>
        <div className = "flex flex-col justify-center items-center w-1/6">
            {
                (unlinkAudio === undefined ? null : 
                    <div className = "p-1">
                        <button onClick = {() => {
                            unlinkAudio()}}> 
                            <img src = "/logo/delete.svg" className = "object-contain"></img>
                        </button>
                    </div>
                )
            }
            {
                (redo === undefined ? null : 
                    <div className = "p-1">
                        <button onClick = {redo}> 
                                <img src = "/logo/redo_purple.svg" className = "object-contain"></img>
                        </button>
                </div>)
            }
            
        </div>
        
        
    </div>
  );
}
export default AudioCard