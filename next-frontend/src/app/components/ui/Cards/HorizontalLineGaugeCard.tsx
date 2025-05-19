import React from "react";
import LineGauge from "../Gauges/LineGauge";

interface GaugeConfig {
  label: string;
  currentValue: number;
  minValue?: number;
  maxValue?: number;
  units?: string;
  valueDecimals?: number;
  underline?: boolean;
}

interface HorizontalLineGaugeCardProps {
  gauges: GaugeConfig[];
}

const HorizontalLineGaugeCard = ({ gauges }: HorizontalLineGaugeCardProps) => (
  <div className="bg-[#26233a] rounded-2xl p-6 flex flex-row gap-8 justify-center items-start w-fit">
    {gauges.map((g, idx) => (
      <div key={g.label} className="flex flex-col items-start w-[320px]">
        <p
          className={`text-gray-200 text-lg mb-2 ${
            g.underline ? "underline decoration-purple-400 decoration-4 underline-offset-4" : ""
          }`}
        >
          {g.label}
        </p>
        <LineGauge
          currentValue={g.currentValue}
          minValue={g.minValue}
          maxValue={g.maxValue}
          label=""
          units={g.units}
        //   valueDecimals={g.valueDecimals}
        />
      </div>
    ))}
  </div>
);

export default HorizontalLineGaugeCard;