"use client"

import {useEffect, useState} from "react";
const coolantLimit = 40
const batteryLimit = 30
const oxygenLimit = 20
const getErrorCard = (message : String, xEffect : () => void) => {
    return(
        <div className = "relative m-2 bg-warning border-l-2 border-crimson-red w-1/2 rounded-lg">
            <div className = "flex justify-center items-center p-5 justify-items-center text-2xl font-bold">
                <p className = "pointer-events-none">{message}</p>
            </div>
            <button onClick = {xEffect} className = "absolute top-0 right-0 m-2 pointer-events-auto">
                <img src = "/logo/close.svg"></img>
            </button> 
        </div>
    )
}

export const Warnings = () => {
    const [coolantLevel, setCoolantLevel] = useState(100)
    const [batteryLevel, setBatteryLevel] = useState(100)
    const [oxygenLevel, setOxygenLevel] = useState(100)

    const [remindCoolant, setRemindCoolant] = useState(true)
    const [remindBattery, setRemindBattery] = useState(true)
    const [remindOxygen, setRemindOxygen] = useState(true)


    useEffect(() => {
        const fetchErrors = async() => {
            try {
                const data = await fetch('/api/warning-stats');
                const res = await data.json();
                setBatteryLevel(res["batteryLevel"])
                setCoolantLevel(res["prCoolantLevel"])
                setOxygenLevel(res["oxygenLevels"])
                if(res["prCoolantLevel"] > coolantLimit)
                {
                    setRemindCoolant(true);
                }
                if(res["batteryLevel"] > batteryLimit)
                {
                    setRemindBattery(true);
                }
                if(res["oxygenLevels"] > oxygenLimit)
                {
                    setRemindOxygen(true);
                }
                
            } catch (e) {
                console.error("Failed to fetch: ", e);
            }
        }
        fetchErrors()
        const interval = setInterval(fetchErrors, 3000);//set a loop to check warnings every second
        return () => clearInterval(interval)
    }, [])
    return (
        <>
            {(coolantLevel < coolantLimit && remindCoolant) ? getErrorCard("ABORT NOW: COOLANT", () => {setRemindCoolant(false)}) : null}
            {(batteryLevel < batteryLimit && remindBattery) ? getErrorCard("ABORT NOW: BATTERY", () => {setRemindBattery(false)}) : null}
            {(oxygenLevel < oxygenLimit && remindOxygen) ? getErrorCard("ABORT NOW: OXYGEN", () => {setRemindOxygen(false)}) : null}
        </>
        
    )
}

export default Warnings;