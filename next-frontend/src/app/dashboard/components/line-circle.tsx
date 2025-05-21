import CircularGauge from "@/app/components/ui/Gauges/CircularGauge";
import LineGauge from "@/app/components/ui/Gauges/LineGauge";



export function LineCircle({circleValue, circleLabel, lineValue, lineLabel}: {circleValue: number, circleLabel: string, lineValue: number, lineLabel: string}) {
    return (
        <div className="flex basis-1/2 flex-col gap-4 bg-white bg-opacity-10 p-4 rounded-lg">
            <CircularGauge label={circleLabel} currentValue={circleValue} />
            <LineGauge label={lineLabel} currentValue={lineValue} />
        </div>
    )
}