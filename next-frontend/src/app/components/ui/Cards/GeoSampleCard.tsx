import { useState } from "react";
import SecondaryButton from "../ui-buttons/SecondaryButton";
import { GeoResponse } from "@/app/api/geo-data/route";

interface GeoSampleCardProps {
    setControlPanelState: (state: "AddTag" |"AddVoiceNote" | "EvDetails") => void;
    sample: GeoResponse;
}

export const GeoSampleCard = ({setControlPanelState, sample}: GeoSampleCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleExpand = () => {
        setIsExpanded(prev => !prev);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    };

    return (
        <div className="flex flex-col rounded-xl mb-4 border-solid border-b-1 border-white/10">
            {/* Header */}
            <div className="flex items-center p-3 justify-between gap-4">
                <div className="flex gap-2">
                    <p className="text-2xl font-bold">Sample {sample.id}</p>
                    <img src="/logo/flag.svg" className="w-8 h-8"/>
                </div>
                <button onClick={handleExpand}>
                    <img
                        src={isExpanded ? "/logo/minimize.svg" : "/logo/expand.svg"}
                        alt="expand"
                        className={`h-5 w-5 min-w-[20px] min-h-[20px] transition-transform duration-300`}
                    />
                </button>
            </div>

            {/* Meta Info */}
            <div className="flex p-3 pt-0 flex-col gap-2">
                <div className="flex gap-2">
                    <img src="/logo/poi-stroke.svg" className="w-6 h-6"/>
                    <p className="text-sm">--</p>                  
                </div>
                {/* info */}
                <div className="flex pt-0 gap-2">
                    <div className="inline-flex px-3 py-1 justify-center items-center bg-white/10 rounded-3xl">
                        Collected at {formatTime(new Date(sample.createdAt))}
                    </div>
                    
                </div>
            </div>

            {/* Animated Expandable Section */}
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden px-4
                    ${isExpanded ? "max-h-[500px] opacity-100 py-4" : "max-h-0 opacity-0 py-0"}`}
            >
                <div className="flex flex-col gap-2">
                    <p className="text-xl font-bold">Composition</p>

                    {/* grid*/}
                    <div className="grid grid-cols-2 border-[.5px] border-white/50 divide-x-[.5px] divide-solid divide-white/50 rounded-xl text-xs">

                        {/* left main column */}
                        <div className="grid grid-rows-5 divide-y-[.5px] divide-solid divide-white/50">

                            {/* SiO2 */}
                            <div className="grid grid-cols-2 divide-x-[.5px] divide-solid divide-white/50">
                                <div className="p-1 flex gap-1">
                                    <p>SiO<small>2</small></p>
                                </div>
                                <div className="p-1 flex gap-1">
                                    <p>{sample.sio2.toFixed(2)}%</p>
                                </div>
                            </div>

                            {/* TiO2 */}
                            <div className="grid grid-cols-2 divide-x-[.5px] divide-solid divide-white/50">
                                <div className="p-1 flex gap-1">
                                    <p>TiO<small>2</small></p>
                                </div>
                                <div className="p-1 flex gap-1">
                                    <p>{sample.tio2.toFixed(2)}%</p>
                                </div>
                            </div>

                            {/* Al2O3 */}
                            <div className="grid grid-cols-2 divide-x-[.5px] divide-solid divide-white/50">
                                <div className="p-1 flex gap-1">
                                    <p>Al<small>2</small>O<small>3</small></p>
                                </div>
                                <div className="p-1 flex gap-1">
                                    <p>{sample.al2o3.toFixed(2)}%</p>
                                </div>
                            </div>
                            
                            {/* FeO*/}
                            <div className="grid grid-cols-2 divide-x-[.5px] divide-solid divide-white/50">
                                <div className="p-1 flex gap-1">
                                    <p>FeO</p>
                                </div>
                                <div className="p-1 flex gap-1">
                                    <p>{sample.feo.toFixed(2)}%</p>
                                </div>
                            </div>

                            {/* MnO */}
                            <div className="grid grid-cols-2 divide-x-[.5px] divide-solid divide-white/50">
                                <div className="p-1 flex gap-1">
                                    <p>MnO</p>
                                </div>
                                <div className="p-1 flex gap-1">
                                    <p>{sample.mno.toFixed(2)}%</p>
                                </div>
                            </div>

                        </div>

                        {/* right main column */}   
                        <div className="grid grid-rows-5 divide-y-[.5px] divide-solid divide-white/50">

                            {/* MgO */}
                            <div className="grid grid-cols-2 divide-x-[.5px] divide-solid divide-white/50">
                                <div className="p-1 flex gap-1">
                                    <p>MgO</p>
                                </div>
                                <div className="p-1 flex gap-1">
                                    <p>{sample.mgo.toFixed(2)}%</p>
                                </div>
                            </div>

                            {/* CaO */}
                            <div className="grid grid-cols-2 divide-x-[.5px] divide-solid divide-white/50">
                                <div className="p-1 flex gap-1">
                                    <p>CaO</p>
                                </div>
                                <div className="p-1 flex gap-1">
                                    <p>{sample.cao.toFixed(2)}%</p>
                                </div>
                            </div>

                            {/* K2O */}
                            <div className="grid grid-cols-2 divide-x-[.5px] divide-solid divide-white/50">
                                <div className="p-1 flex gap-1">
                                    <p>K<small>2</small>O</p>
                                </div>
                                <div className="p-1 flex gap-1">
                                    <p>{sample.k2o.toFixed(2)}%</p>
                                </div>
                            </div>

                            {/* P2O3 */}
                            <div className="grid grid-cols-2 divide-x-[.5px] divide-solid divide-white/50">
                                <div className="p-1 flex gap-1">
                                    <p>P<small>2</small>O<small>3</small></p>
                                </div>
                                <div className="p-1 flex gap-1">
                                    <p>{sample.p2o3.toFixed(2)}%</p>
                                </div>
                            </div>

                            {/* Other */}
                            <div className="grid grid-cols-2 divide-x-[.5px] divide-solid divide-white/50">
                                <div className="p-1 flex gap-1">
                                    <p>Other</p>
                                </div>
                                <div className="p-1 flex gap-1">
                                    <p>{sample.other.toFixed(2)}%</p>
                                </div>
                            </div>
                                                                                    
                        </div>                        
                   
                    </div>

                    <div className="w-full pt-4">
                        <SecondaryButton logo="/logo/sound-purple.svg" onClick={() => setControlPanelState("AddVoiceNote")}
                        >Add Voice Note</SecondaryButton>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default GeoSampleCard;