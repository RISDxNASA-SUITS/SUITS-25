"use client";
import React from "react";

interface VerticalTextReadoutCardProps {
  readouts: {
    label: string;
    value: number | string;
    units?: string;
    decimals?: number;
  }[];
}

const VerticalTextReadoutCard = ({ readouts }: VerticalTextReadoutCardProps) => (
  <div
    className="p-2 bg-white/10 rounded-2xl inline-flex flex-col justify-start items-start gap-10"
    style={{ width: 180, height: 392 }}
  >
    {readouts.map((r) => (
      <div
        key={r.label}
        data-property-1="number"
        className="self-stretch px-2 py-1 rounded-lg flex flex-col justify-start items-start"
      >
        <div className="self-stretch h-5 inline-flex justify-between items-center">
          <div className="flex-1 justify-center text-white text-sm font-normal font-['IBM_Plex_Sans']">
            {r.label}
          </div>
        </div>
        <div className="self-stretch justify-start text-white text-2xl font-bold font-['IBM_Plex_Sans']">
          {typeof r.value === "number" && r.decimals !== undefined
            ? r.value.toLocaleString(undefined, { minimumFractionDigits: r.decimals, maximumFractionDigits: r.decimals })
            : r.value}
          {r.units && <span className="ml-1">{r.units}</span>}
        </div>
      </div>
    ))}
  </div>
);

export default VerticalTextReadoutCard;