import GeoSampleCard from "@/app/components/ui/Cards/GeoSampleCard"
import { useState, useEffect } from "react"
import { GeoResponse } from "@/app/api/geo-data/route"
import { usePanelStore } from "@/app/hooks/panelStore";
import { PoiStore } from "@/app/hooks/PoiStore";

interface XrfSectionProps {
    setControlPanelState: (state: "AddTag" |"AddVoiceNote" | "EvDetails") => void;
}

export default function XrfSection() {
    const [geoData, setGeoData] = useState<GeoResponse[]>([]);
    const {setPanelState} = usePanelStore();
    const { pois } = PoiStore();

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

    // Get POIs with type 'geologicalSample'
    const geoPois = pois.filter(poi => poi.type === 'geologicalSample');

    // Combine both geo samples and POIs
    const allSamples = [
        ...geoData,
        ...geoPois
    ];

    return (
        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-white-10 scrollbar-track-transparent">
            {allSamples.map((sample, index) => (
                <GeoSampleCard 
                    key={index}
                    sample={sample} 
                    setControlPanelState={setPanelState}
                />
            ))}
        </div>
    )
}