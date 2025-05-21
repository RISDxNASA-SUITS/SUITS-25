import { useState, useEffect } from "react";
import useTaskStore from "@/app/hooks/taskCounterHook";
import { usePoiAdderHook } from "@/app/hooks/poiAdderHook";

export const Notifications = () => {
    const [mounted, setMounted] = useState(false)
    const [showTaskCard, setShowTaskCard] = useState(false)
    const [showPoiCard, setShowPoiCard] = useState(false)
    
    const {tasksComplete, tasksTotal} = useTaskStore()
    const {poiLat, poiLon, poiType} = usePoiAdderHook()

    const [taskBar, setTaskBar] = useState(0)
    const [taskTimer, setTaskTimer] = useState<NodeJS.Timeout | undefined>(undefined)
    useEffect(() => {
        if(!mounted){
            return
        }
        setTaskBar(0)
        setShowTaskCard(true)
        if(taskTimer != undefined){
            clearTimeout(taskTimer)
        }
        const interval = setInterval(() => {
                setTaskBar((bar) => bar + 50)
            }, 50)
        setTaskTimer(setTimeout(() =>{
                setShowTaskCard(false)
                clearInterval(interval)
            }, 10000))
        return () => {clearInterval(interval); clearTimeout(taskTimer)}
    }, [tasksComplete])

    const [poiBar, setPoiBar] = useState(0)
    const [poiTimer, setPoiTimer] = useState<NodeJS.Timeout | undefined>(undefined)
    useEffect(() => {
        if(!mounted){
            setMounted(true)
            return
        }
        setPoiBar(0)
        setShowPoiCard(true)
        if(poiTimer != undefined){
            clearTimeout(poiTimer)
        }
        const interval = setInterval(() => {
                setPoiBar((bar) => bar + 50)
            }, 50)
        setPoiTimer(setTimeout(() =>{
                setShowPoiCard(false)
                clearInterval(interval)
            }, 10000))
        return () => {clearInterval(interval); clearTimeout(poiTimer)}
    }, [poiLat, poiLon, poiType])


    const getTaskCompleteCard = (xEffect : () => void) => {
        return(
            <div className = "relative m-2 bg-green-500 border-l-2 border-green-700 w-1/2 rounded-lg bg-opacity-25">
                <div className = "flex p-1 items-center text-2xl font-bold">
                    <img src={"/logo/checkmark.svg"} alt="poi" className="h-5 w-5" />
                    <div className = "flex flex-col pointer-events-none justify-around items-center flex-grow">
                        <div className = 'p-4'>
                            <p>You completed {tasksComplete} / {tasksTotal} tasks!</p>
                        </div>
                        <progress value = {taskBar / 10000} className = "w-5/6 h-1 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg   [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-green-800"></progress>
                    </div>
                </div>
                <button onClick = {() => {
                    xEffect();
                    if(taskTimer != undefined){
                        clearTimeout(taskTimer)
                    }
                }} className = "absolute top-0 right-0 m-2 pointer-events-auto">
                    <img src = "/logo/close.svg"></img>
                </button> 
            </div>
        )
    }
    const getPoiAdderCard = (xEffect : () => void) => {
        return(
            <div className = "relative m-2 bg-green-500 border-l-2 border-green-700 w-1/2 rounded-lg bg-opacity-25">
                <div className = "flex p-1 items-center text-2xl font-bold">
                    <img src={"/logo/checkmark.svg"} alt="poi" className="h-5 w-5" />
                    <div className = "flex flex-col pointer-events-none justify-around items-center flex-grow">
                        <div className = 'p-4'>
                            <p className = "text-center">You placed a {poiType === 'Poi' ? "Pin" : "Hazard"} POI at <br />({poiLat?.toFixed(4)}, {poiLon?.toFixed(4)})</p>
                        </div>
                        <progress value = {poiBar / 10000} className = "w-5/6 h-1 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg   [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-green-800"></progress>
                    </div>
                </div>
                <button onClick = {() => {
                    xEffect();
                    if(poiTimer != undefined){
                        clearTimeout(poiTimer)
                    }
                }} className = "absolute top-0 right-0 m-2 pointer-events-auto">
                    <img src = "/logo/close.svg"></img>
                </button> 
            </div>
        )
    }
    
    return (
        <>
            {showTaskCard ? getTaskCompleteCard(() => {
                setShowTaskCard(false)}) : null}
            {showPoiCard ? getPoiAdderCard(() => {
                setShowPoiCard(false)}) : null}
        </>
        
    )
}
export default Notifications
