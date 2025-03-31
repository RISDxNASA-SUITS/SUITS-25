"use client"

import {useEffect, useState} from "react";
import MainTab from "@/app/components/MapPage/ControlPanel/EvDetails/Tabs/MainTab";
import SubTabButton from "@/app/components/MapPage/ControlPanel/EvDetails/Tabs/SubTabButton";
import TasksSection from "@/app/components/MapPage/ControlPanel/EvDetails/Sections/TasksSection";
import WarningSection from "@/app/components/MapPage/ControlPanel/EvDetails/Sections/WarningSection";
import XrfSection from "@/app/components/MapPage/ControlPanel/EvDetails/Sections/XrfSection";

type EvaTab = "EVA1" | "EVA2"

type SubTab = "Tasks" | "Warnings" | "XRFData"

type Eva = {
    Tasks?: any;
    Warnings?: any;
    XRFData?: any;
}

export const EvDetails = () => {
    const [selectedEva, setSelectedEva] = useState<EvaTab>("EVA1");
    const [selectedSubTab, setSelectedSubTab] = useState<SubTab>("Tasks");
    const [evaData, setEvaData] = useState<Record<EvaTab, Eva>>({
        EVA1: {},
        EVA2: {}
    });

    useEffect(() => {
        const mockData: Record<EvaTab, Eva> = {
            EVA1: {
                Tasks: [
                    {taskName: "EVs turn on Power", station: "Station 1"},
                    {taskName: "Geo Sampling", station: "Station 5"},
                    {taskName: "Prep O2 Tanks", station: "Station 5"},
                    {taskName: "Connect UIA to DCU", station: "Station 5"},
                    {taskName: "Begin navigation to Point B", station: "Station 5"},
                ],
                Warnings: [{message: "Battery Failure", description: "Battery level below 10%"}],
                XRFData: [{magnesium: "10%", calcium: "0.5%"}]
            },
            EVA2: {
                Tasks: [
                    {taskName: "Connect UIA and DCU umbilical", station: "Station 3"},
                    {taskName: "Geo Sampling", station: "Station 2"}
                ],
                Warnings: [{message: "Water Pump Failure", description: "Water Pump level low"}],
                XRFData: [{magnesium: "20%", calcium: "10%", calcite: "0.1%"}]
            }
        };

        setEvaData(mockData);
    }, []);


    function handleContent() {
        const data = evaData[selectedEva][selectedSubTab];

        switch (selectedSubTab) {
            case "Tasks":
                return <TasksSection tasks={data} />;
            case "Warnings":
                return <WarningSection warnings={data} />;
            case "XRFData":
                return <XrfSection xrfData={data} />
        }
    }

    return (
        <div className={"flex flex-col gap-5 w-full h-full"}>
            <div className={"text-2xl font-bold"}>EV Details</div>

            <MainTab selected={selectedEva} onSelect={setSelectedEva}/>

            <div className={`flex gap-4`}>
                {(["Tasks", "Warnings", "XRFData"] as const).map(tab => {
                    return (
                        <SubTabButton
                            key={tab}
                            selected={tab}
                            isSelected={tab === selectedSubTab}
                            onSelect={() => {setSelectedSubTab(tab)}}/>
                    )
                })}
            </div>

            {handleContent()}
        </div>
    )
}

export default EvDetails;