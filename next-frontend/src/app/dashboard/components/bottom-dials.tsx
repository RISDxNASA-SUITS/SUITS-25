import CircularGauge from "@/app/components/ui/Gauges/CircularGauge";
import LineGauge from "@/app/components/ui/Gauges/LineGauge";

interface GaugeValue {
    value: number;
    label: string;
}

interface BottomDialsProps {
    circularGauges: [GaugeValue, GaugeValue];
    linearGauges: [GaugeValue, GaugeValue, GaugeValue, GaugeValue];
    labels: [string, string, string, string];
    values: [string, string, string, string];
}

export default function BottomDials({ circularGauges, linearGauges, labels, values }: BottomDialsProps) {
    return (
        <div className="flex flex-row basis-2/5 h-full gap-4 p-4 bg-white bg-opacity-10 rounded-lg">
            <div className="flex flex-col gap-4">
                <CircularGauge
                    currentValue={circularGauges[0].value}
                    label={circularGauges[0].label}
                />
                <CircularGauge
                    currentValue={circularGauges[1].value}
                    label={circularGauges[1].label}
                />
            </div>
            <div className="flex flex-col gap-4">
                <LineGauge
                    currentValue={linearGauges[0].value}
                    label={linearGauges[0].label}
                />
                <LineGauge
                    currentValue={linearGauges[1].value}
                    label={linearGauges[1].label}
                />
                <LineGauge
                    currentValue={linearGauges[2].value}
                    label={linearGauges[2].label}
                />
                <LineGauge
                    currentValue={linearGauges[3].value}
                    label={linearGauges[3].label}
                />
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
            {[1,2,3,4 ].map((val, index) => (
            <div className="flex flex-col justify-center items-center basis-1/4 gap-4">
                <div className="text-white-50 text-sm">{labels[index]}</div>
                <div className="text-xl font-bold">{values[index]}</div>
            </div>
        ))}
            </div>
        </div>
    )
}