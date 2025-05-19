"use client";
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
  <div
    className="p-2 bg-white/10 rounded-2xl inline-flex justify-between items-center"
    style={{ width: 592 }}
  >
    {gauges.map((g, idx) => (
      <div
        key={g.label}
        className="w-40 h-28 px-2 py-1 rounded-lg inline-flex flex-col justify-center items-center"
      >
        <div className="self-stretch text-center text-white text-sm font-normal font-['IBM_Plex_Sans']">
          {g.label}
        </div>
        <div className="self-stretch text-center text-white text-5xl font-medium font-['IBM_Plex_Sans']">
          {typeof g.value === "number" && g.decimals !== undefined
            ? g.value.toFixed(g.decimals)
            : g.value}
          {g.units}
        </div>
        <div className="px-2 py-1 bg-white/10 rounded-[20px] inline-flex justify-center items-center gap-1 mt-1">
          <div className="text-white text-[10px] font-semibold font-['IBM_Plex_Sans']">
            {g.status}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default HorizontalTextGaugeCard;