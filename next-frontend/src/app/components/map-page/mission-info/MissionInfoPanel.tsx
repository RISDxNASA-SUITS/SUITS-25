"use client"

import {useEffect, useState} from "react";

export const MissionInfoPanel = () => {
    const [missionTimer, setMissionTimer] = useState("00:00:00");
    const [timeToStation, setTimeToStation] = useState("00:00:00");
    const [prSpeed, setPrSpeed] = useState(0);
    const [prAngle, setPrAngle] = useState(0);
    const [prDirection, setPrDirection] = useState("N");

    //TODO: fetch from backend
    useEffect(() => {
    
    })

    return (
        <div className={"flex items-center text-white gap-3 border-b-2 border-[#28233E]"}>
            <div className={"flex p-6 justify-between w-full items-start"}>
                <div>
                    <p className={"text-l text-white"}>Mission Timer</p>
                    <p className={"text-4xl font-bold text-white"}>{missionTimer}</p>
                </div>

                <div>
                    <p className={"text-l text-white"}>Time to Station</p>
                    <p className={"text-4xl font-bold text-white"}>{timeToStation}</p>
                </div>

                <div>
                    <p className={"text-l text-white"}>PR Speed</p>
                    <p className={"text-4xl font-bold text-white"}>{prSpeed}MPH</p>
                </div>

                <div>
                    <p className={"text-l text-white"}>PR Angle/Direction</p>
                    <div className={"flex flex-row items-center gap-4"}>
                        <img src={"/logo/direction.svg"} alt="direction" className="h-7 w-7" />
                        <p className={"text-4xl font-bold text-white"}>{prAngle}° {prDirection}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MissionInfoPanel;