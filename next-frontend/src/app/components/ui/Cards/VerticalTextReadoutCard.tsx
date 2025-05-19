import React from "react";
import TextReadout from "../Gauges/TextReadout";

interface VerticalTextReadoutCardProps {
  readouts: {
    label: string;
    value: number | string;
    units?: string;
    decimals?: number;
  }[];
}

const VerticalTextReadoutCard = ({ readouts }: VerticalTextReadoutCardProps) => (
  <div className="bg-[#26233a] rounded-2xl p-6 flex flex-col gap-12 w-80">
    {readouts.map((r, idx) => (
      <TextReadout
        key={r.label}
        label={r.label}
        value={r.value}
        units={r.units}
        decimals={r.decimals}
      />
    ))}
  </div>
);

export default VerticalTextReadoutCard;