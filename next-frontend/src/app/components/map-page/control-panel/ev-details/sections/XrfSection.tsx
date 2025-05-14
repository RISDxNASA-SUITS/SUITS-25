import GeoSampleCard from "@/app/components/ui/Cards/GeoSampleCard"

interface XrfSectionProps {
    xrfData?: any
}

export default function XrfSection({xrfData}: XrfSectionProps) {
    return (
        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-white-10 scrollbar-track-transparent">
            <GeoSampleCard/>
        </div>
    )
}