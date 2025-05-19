import GeoSampleCard from "@/app/components/ui/Cards/GeoSampleCard"

interface XrfSectionProps {
    xrfData?: any
    setControlPanelState: (state: "AddTag" |"AddVoiceNote" | "EvDetails") => void;
}

export default function XrfSection({xrfData, setControlPanelState}: XrfSectionProps) {
    return (
        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-white-10 scrollbar-track-transparent">
            <GeoSampleCard setControlPanelState={setControlPanelState}/>
        </div>
    )
}