"use client";
import React from "react";
import CircularGauge from "../Gauges/CircularGauge";
import LineGauge from "../Gauges/LineGauge";

interface MultiGaugeCardProps {
  oxygenTank: number;
  oxygenLevel: number;
  oxygenPressure: number;
  coolantTank: number;
  coolantLevel: number;
  coolantPressure: number;
}

const MultiGaugeCard = ({
  oxygenTank,
  oxygenLevel,
  oxygenPressure,
  coolantTank,
  coolantLevel,
  coolantPressure,
}: MultiGaugeCardProps) => (
  <div
    style={{
      width: "fit-content",         // Hug width
      height: 392,                  // Fixed height
      borderRadius: 16,             // radius/16
      background: "rgba(255,255,255,0.10)",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      gap: 24,
      padding: 8,
      boxSizing: "border-box",
    }}
  >
    {/* Left: Circular Gauges */}
    <div
      style={{
        width: 160,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 24,
      }}
    >
      <CircularGauge
        currentValue={oxygenTank}
        minValue={0}
        maxValue={100}
        label="Oxygen Tank"
        units="%"
        rectWidth={160}
      />
      <CircularGauge
        currentValue={coolantTank}
        minValue={0}
        maxValue={100}
        label="Coolant Tank"
        units="%"
        rectWidth={160}
      />
    </div>
    {/* Right: Line Gauges */}
    <div
      style={{
        flex: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 24,
      }}
    >
      <LineGauge
        currentValue={oxygenLevel}
        minValue={0}
        maxValue={100}
        label="Oxygen Levels"
        units="%"
        widthPx={178}
        backgroundWidthPx={162}
      />
      <LineGauge
        currentValue={oxygenPressure}
        minValue={0}
        maxValue={3000}
        label="Oxygen Pressure"
        units="psi"
        widthPx={178}
        backgroundWidthPx={162}
      />
      <LineGauge
        currentValue={coolantLevel}
        minValue={0}
        maxValue={100}
        label="Coolant Level"
        units="L"
        widthPx={178}
        backgroundWidthPx={162}
      />
      <LineGauge
        currentValue={coolantPressure}
        minValue={0}
        maxValue={1000}
        label="Coolant Pressure"
        units="psi"
        widthPx={178}
        backgroundWidthPx={162}
      />
    </div>
  </div>
);

export default MultiGaugeCard;