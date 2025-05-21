import {useRef, useState, useEffect} from "react";
const coolantLimit = 40
const batteryLimit = 30
const oxygenLimit = 25

const getPositiveBox = (text : String) => {
    return(<div className = "flex border-green-700 border w-auto rounded-xl bg-green-500 bg-opacity-50 p-2">
        <div className = "flex justify-center items-center w-1/12">
            <img src = "/logo/checkmark.svg" className = "object-contain"></img>
        </div>
        <div className = "flex-grow text-l text-center">{text}</div>
    </div>)
}
const getErrorBox = (battery : number, coolant : number, oxygen : number) => {
    let errorText = "If you proceed, you will not have enough " + 
    (battery < batteryLimit ? "battery, " : "") + 
    (coolant < coolantLimit ? "coolant, " : "") + 
    (oxygen < oxygenLimit ? "oxygen, " : "")
    errorText = errorText.slice(0, -2)
    errorText += ". This is a point of no return."

    return(<div className = "flex border-crimson-red border-l-2 border w-auto rounded-xl bg-warning bg-opacity-50 p-2">
        <div className = "flex justify-center items-center w-1/6">
            <img src = "/logo/hazard.svg" className = "object-contain"></img>
        </div>
        <div className = "flex-grow text-l text-center">{errorText}</div>
    </div>)
}
const AddWarning = () => {
    const [battery, setBattery] = useState<number>(100);
    const [coolant, setCoolant] = useState<number>(100);
    const [oxygen, setOxygen] = useState<number>(100);

    useEffect(() => {
        const fetchWarnings = async () => {
            const data = await fetch('/api/warning-stats');
            const res = await data.json();
            setBattery(res["batteryLevel"])
            setCoolant(res["prCoolantLevel"])
            setOxygen(res["oxygenLevels"])
        };
        fetchWarnings();
        const interval = setInterval(fetchWarnings, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);
    return (
        <>
        {(battery > batteryLimit && coolant > coolantLimit && oxygen >oxygenLimit) ? getPositiveBox("PR Resources Sufficient") : 
        
        getErrorBox(battery, coolant, oxygen)}
        </>
    );
}
export default AddWarning