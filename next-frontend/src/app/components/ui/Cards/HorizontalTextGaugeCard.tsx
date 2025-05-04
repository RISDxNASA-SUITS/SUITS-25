import React from "react";
import TextGauge from "../Gauges/TextGauge";

interface HorizontalTextGaugeCardProps {
  gauges: {
    label: string;
    value: number | string;
    units?: string;
    decimals?: number;
    status?: string;
  }[];
}

const HorizontalTextGaugeCard = ({ gauges }: HorizontalTextGaugeCardProps) => (
  <div className="bg-[#26233a] rounded-2xl p-6 flex flex-row gap-8 justify-center items-start w-fit">
    {gauges.map((g, idx) => (
      <TextGauge
        key={g.label}
        label={g.label}
        value={g.value}
        units={g.units}
        decimals={g.decimals}
        status={g.status}
      />
    ))}
  </div>
);

export default HorizontalTextGaugeCard;