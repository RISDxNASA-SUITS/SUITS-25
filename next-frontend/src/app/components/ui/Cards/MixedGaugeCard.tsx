"use client";
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
}: MixedGaugeCardProps) => {
  return (
    <div
      style={{
        width: 284,
        minHeight: 0,
        height: "auto",
        borderRadius: 16,
        backgroundColor: "#28233E",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        padding: 8,
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* Circular Gauge */}
      <div style={{ width: 268, height: 268 }}>
        <CircularGauge
          currentValue={storageValue}
          minValue={0}
          maxValue={100}
          label={storageLabel}
          units="%"
          rectWidth={268}
        />
      </div>
      {/* Line Gauge */}
      <div
        style={{
          width: 268,
        }}
      >
        <LineGauge
          currentValue={pressureValue}
          minValue={pressureMin}
          maxValue={pressureMax}
          label={pressureLabel}
          units={pressureUnits}
          widthPx={268}
          backgroundWidthPx={252}
        />
      </div>
    </div>
  );
};

export default MixedGaugeCard;