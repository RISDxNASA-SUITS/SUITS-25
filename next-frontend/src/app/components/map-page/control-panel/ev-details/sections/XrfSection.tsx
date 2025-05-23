import GeoSampleCard from "@/app/components/ui/Cards/GeoSampleCard"
import { useState, useEffect } from "react"
import { GeoResponse } from "@/app/api/geo-data/route"
import { usePanelStore } from "@/app/hooks/panelStore";

interface XrfSectionProps {
    setControlPanelState: (state: "AddTag" |"AddVoiceNote" | "EvDetails") => void;
}

export default function XrfSection() {
    const [geoData, setGeoData] = useState<GeoResponse[]>([]);
    const {setState} = usePanelStore();

    useEffect(() => {
        const fetchGeoData = async () => {
            const response = await fetch('/api/geo-data')
            const data = await response.json()
            setGeoData(data)
        }
        fetchGeoData()
        const interval = setInterval(() => {
            fetchGeoData()
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-white-10 scrollbar-track-transparent">
            {geoData.map((sample) => (
                <GeoSampleCard 
                    key={sample.id}
                    sample={sample} 
                    setControlPanelState={setState}
                />
            ))}
        </div>
    )
}