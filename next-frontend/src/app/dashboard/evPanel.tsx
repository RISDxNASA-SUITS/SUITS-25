import VideoPanel from "./components/video-panel";
import { evTelem } from "../hooks/dashboardHook";

import { ThreeHorizontal } from "./components/threeHorizontal";
import ThreeBig from "./components/three-big";
import { LineCircle } from "./components/line-circle";
export function EvPanel({evData}: {evData: evTelem}) {
    return (
        <div className="flex flex-col basis-1/3 gap-4 h-[80%]">
            <VideoPanel video="/videos/video.mp4" name="Oxygen" />
            <ThreeBig labels={["Heart Rate", "02 Consumption", "CO2 Production"]} values={[`${evData.heart_rate.toFixed(2)}bpm`, `${evData.oxy_consumption.toFixed(2)}psi`, `${evData.co2_production.toFixed(2)}psi`]} />
            <ThreeHorizontal labels={["O2 Primary", "O2 Secondary", "Battery"]} values={[`${evData.oxy_pri_storage.toFixed(2)}psi`, `${evData.oxy_sec_storage.toFixed(2)}psi`, `${evData.batt_time_left.toFixed(2)}s`]} />
            <div className="flex flex-row gap-4">
                <LineCircle circleValue={evData.oxy_pri_storage} circleLabel="O2 Primary" lineValue={evData.oxy_sec_storage} lineLabel="O2 Secondary" />
                <LineCircle circleValue={evData.oxy_pri_storage} circleLabel="O2 Primary" lineValue={evData.oxy_sec_storage} lineLabel="O2 Secondary" />
            </div>
        </div>
    )
}