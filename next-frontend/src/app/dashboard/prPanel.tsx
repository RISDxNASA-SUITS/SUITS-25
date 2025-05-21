import BottomDials from "./components/bottom-dials";
import ThreeBig from "./components/three-big";
import VideoPanel from "./components/video-panel";
import { prTelem } from "@/app/hooks/dashboardHook";
import { useDashboardStore } from "@/app/hooks/dashboardHook";
import { BottomHorizontal } from "./components/bottom-horizontal";


export default function PRPanel({prData}: {prData: prTelem}) {
    if (!Object.keys(prData).length) {
        return <div>Loading...</div>
    }
    return (
        <div className="flex flex-col basis-1/3 gap-4 h-[80%]">
            <VideoPanel video="/videos/video.mp4" name="Oxygen" />
            <ThreeBig labels={["Cabin Temp.", "Cabin Pressure", "Battery Level"]} values={[`${prData.cabinTemperature.toFixed(2)}F`, 
                `${prData.cabinPressure.toFixed(2)}PSI`, 
                `${prData.batteryLevel.toFixed(2)}%`]} />
            <BottomDials 
                circularGauges={[
                    { value: prData.oxygenTank, label: "Oxygen Tank" },
                    { value: prData.prCoolantTank, label: "Coolant Tank" }
                ]}
                linearGauges={[
                    { value: prData.oxygenLevels, label: "Oxygen Levels" },
                    { value: prData.oxygenPressure, label: "Oxygen Pressure" },
                    { value: prData.prCoolantLevel, label: "Coolant Level" },
                    { value: prData.prCoolantPressure, label: "Coolant Pressure" }
                ]}
                values={[
                    `${prData.solarPanelEfficiency.toFixed(2)}%`,
                    `${prData.solarPanelDustAccum.toFixed(2)}%`,
                    `${prData.acFanPri.toFixed(0)}RPM`,
                    `${prData.acFanSec.toFixed(0)}RPM`
                ]}
                labels={[
                    "Solar Panel Efficiency",
                    "Solar Panel Dust",
                    "AC Fan Primary",
                    "AC Fan Secondary"
                ]}
            />
         
        </div>
    )
}