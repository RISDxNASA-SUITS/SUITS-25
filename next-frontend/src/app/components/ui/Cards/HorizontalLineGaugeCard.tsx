"use client";
import React from "react";
import LineGauge from "../Gauges/LineGauge";

interface GaugeConfig {
  label: string;
  currentValue: number;
  minValue?: number;
  maxValue?: number;
  units?: string;
  valueDecimals?: number;
}

interface HorizontalLineGaugeCardProps {
  gauges: GaugeConfig[];
}

const HorizontalLineGaugeCard = ({ gauges }: HorizontalLineGaugeCardProps) => (
  <div className="w-[592px] p-2 bg-white/10 rounded-2xl flex flex-row justify-between items-center gap-4">
    {gauges.map((g) => (
      <LineGauge
        key={g.label}
        currentValue={g.currentValue}
        minValue={g.minValue}
        maxValue={g.maxValue}
        label={g.label}
        units={g.units}
        widthPx={180}
        backgroundWidthPx={164}
        // valueDecimals={g.valueDecimals}
      />
    ))}
  </div>
);

export default HorizontalLineGaugeCard;