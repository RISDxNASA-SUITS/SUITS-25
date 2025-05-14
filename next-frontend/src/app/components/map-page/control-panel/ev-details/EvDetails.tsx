"use client"

import {useEffect, useState} from "react";
import MainTab from "@/app/components/ui/Tabs/MainTab";
import SubTabButton from "@/app/components/ui/Tabs/SubTabButton";
import TasksSection from "@/app/components/map-page/control-panel/ev-details/sections/TasksSection";
import WarningSection from "@/app/components/map-page/control-panel/ev-details/sections/WarningSection";
import XrfSection from "@/app/components/map-page/control-panel/ev-details/sections/XrfSection";

type EvaTab = "PR" | "EVA1" | "EVA2"

type SubTab = "Tasks" | "Warnings" | "XRFData"

type Eva = {
    Tasks?: any;
    Warnings?: any;
    XRFData?: any;
}

type EvDetailsProps = {
    setControlPanelState: (state: "AddTag" |"AddVoiceNote" | "EvDetails") => void
}

export const EvDetails = ({setControlPanelState}: EvDetailsProps) => {
    const [selectedEva, setSelectedEva] = useState<EvaTab>("PR");
    const [selectedSubTab, setSelectedSubTab] = useState<SubTab>("Tasks");
    const [evaData, setEvaData] = useState<Record<EvaTab, Eva>>({
        PR: {},
        EVA1: {},
        EVA2: {}
    });

    useEffect(() => {
        const fetchTaskData = async () => {
            try {
                const res = await fetch('/taskData.json');
                const data: Record<EvaTab, Eva> = await res.json();
                setEvaData(data);
            } catch (e) {
                console.error("Failed to fetch: ", e);
            }
        }

        fetchTaskData();
    }, []);


    function handleContent() {
        const data = evaData[selectedEva][selectedSubTab];

        switch (selectedSubTab) {
            case "Tasks":
                return <TasksSection tasks={data} />;
            case "Warnings":
                return <WarningSection warnings={data} />;
            case "XRFData":
                return <XrfSection xrfData={data} setControlPanelState={setControlPanelState}/>
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