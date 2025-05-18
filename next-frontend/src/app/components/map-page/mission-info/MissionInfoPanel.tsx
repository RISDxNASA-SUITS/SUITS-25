"use client"

import {useEffect, useState} from "react";

export const MissionInfoPanel = () => {
    const [missionTimer, setMissionTimer] = useState("00:00:00");
    const [timeToStation, setTimeToStation] = useState("00:00:00");
    const [prSpeed, setPrSpeed] = useState(0);
    const [prAngle, setPrAngle] = useState(0);
    const [prDirection, setPrDirection] = useState("N");
    
    //dropdown row stats
    const [baseDistance, setBaseDistance] = useState("0.000 m");
    const [pitch, setPitch] = useState("15°");
    const [roll, setRoll] = useState("15°");
    const [incline, setIncline] = useState("10°");
    
    const [dropdown, toggleDropdown] = useState<boolean>(false)
    
    const handleDropdown = () => {
        toggleDropdown(!dropdown)
    }
    
    return (
        <div className={"flex items-center text-white gap-3 border-b-2 border-[#28233E]"}>
            
            {/* button and dropdown container */}
            <div className="flex w-full items-start gap-6 p-6">
                
                {/* full dropdown container */}
                <div className="flex flex-col w-full gap-6 justify-start">
                    
                    {/* first row */}
                    
                    <div className={"w-full"}>
                        
                        <div className="flex w-full gap-6 items-start">
                            <div className="flex-1">
                                <p className={"text-l text-white"}>Mission Timer</p>
                                <p className={"text-4xl font-bold text-white"}>{missionTimer}</p>
                            </div>
                            
                            <div className="flex-1">
                                <p className={"text-l text-white"}>Time to Station</p>
                                <p className={"text-4xl font-bold text-white"}>{timeToStation}</p>
                            </div>
                            
                            <div className="flex-1">
                                <p className={"text-l text-white"}>PR Speed</p>
                                <p className={"text-4xl font-bold text-white"}>{prSpeed}MPH</p>
                            </div>
                            
                            <div className="flex-1">
                                <p className={"text-l text-white"}>PR Angle/Direction</p>
                                <div className={"flex flex-row items-center gap-4"}>
                                    <img src={"/logo/direction.svg"} alt="direction" className="h-7 w-7" />
                                    <p className={"text-4xl font-bold text-white"}>{prAngle}° {prDirection}</p>
                                </div>
                            </div>
                        </div>
                    
                    </div>
                    
                    {/* dropdown row */}
                    {dropdown && (
                        <div className={"w-full"}>
                            
                            <div className="flex gap-6 w-full items-start">
                                <div className="flex-1">
                                    <p className={"text-l text-white"}>Distance From Base</p>
                                    <p className={"text-4xl font-bold text-white"}>{baseDistance}</p>
                                </div>
                                
                                <div className="flex-1">
                                    <p className={"text-l text-white"}>Pitch</p>
                                    <p className={"text-4xl font-bold text-white"}>{pitch}MPH</p>
                                </div>
                                
                                <div className="flex-1">
                                    <p className={"text-l text-white"}>Roll</p>
                                    <p className={"text-4xl font-bold text-white"}>{roll}</p>
                                </div>
                                
                                <div className="flex-1">
                                    <p className={"text-l text-white"}>Surface Incline</p>
                                    <p className={"text-4xl font-bold text-white"}>{incline}</p>
                                </div>
                            </div>
                        </div>
                    )}
                
                </div>
                
                {/* button container */}
                <div className="pt-5 flex items-center justify-center h-full">
                    <button className="flex items-center justify-center h-full" onClick={handleDropdown}>
                        <img src={dropdown? `/logo/collapse.svg`: '/logo/dropdown.svg'} alt="dropdown" className="h-8 w-8"></img>
                    </button>
                </div>
            </div>
        
        </div>
    )
}

export default MissionInfoPanel;