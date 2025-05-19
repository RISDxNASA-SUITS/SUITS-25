import React from "react";
import CircularGauge from "../Gauges/CircularGauge";
import LineGauge from "../Gauges/LineGauge";

interface MixedGaugeCardProps {
  storageValue: number;
  storageLabel: string;
  pressureValue: number;
  pressureLabel: string;
  pressureUnits?: string;
  pressureMin?: number;
  pressureMax?: number;
}

const MixedGaugeCard = ({
  storageValue,
  storageLabel,
  pressureValue,
  pressureLabel,
  pressureUnits = "psi",
  pressureMin = 0,
  pressureMax = 1000,
}: MixedGaugeCardProps) => (
  <div className="bg-[#26233a] rounded-2xl p-8 w-[350px] flex flex-col gap-8">
    <div className="flex flex-col items-center">
      <CircularGauge currentValue={storageValue} label={storageLabel} />
    </div>
    <div>
      <LineGauge
        currentValue={pressureValue}
        minValue={pressureMin}
        maxValue={pressureMax}
        label={pressureLabel}
        units={pressureUnits}
      />
    </div>
  </div>
);

export default MixedGaugeCard;