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
  <div 
    style={{
      position: "absolute",
      top: 149,
      width: 592,
      minHeight: 0,
      height: "auto",
      borderRadius: 16,
      background: "rgba(255,255,255,0.10)",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 8,
      gap: 8,
      boxSizing: "border-box",
    }}
  >
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
      />
    ))}
  </div>
);

export default HorizontalLineGaugeCard;