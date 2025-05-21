import LineGauge from "@/app/components/ui/Gauges/LineGauge";



export function ThreeHorizontal({labels, values}: {labels: string[], values: string[]}) {
    return (
        <div className="flex bg-white bg-opacity-10 p-4 rounded-lg flex-row gap-4">
            {labels.map((label, index) => (
                <LineGauge widthPx={150} label={label} currentValue={parseFloat(values[index])} />
            ))}
        </div>
    )
}