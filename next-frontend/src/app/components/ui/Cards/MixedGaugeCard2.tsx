"use client";
import React from "react";
import CircularGauge from "../Gauges/CircularGauge";
import LineGauge from "../Gauges/LineGauge";

export default function MixedGaugeCard2() {
  return (
    <div
      style={{
        width: 592,
        minHeight: 0,
        height: "auto",
        borderRadius: 16,
        background: "#28233E",
        display: "flex",
        flexDirection: "row",
        gap: 24,
        padding: 8,
        boxSizing: "border-box",
      }}
    >
      {/* Left: CircularGauge and one LineGauge stacked */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          flex: "0 0 auto",
        }}
      >
        <CircularGauge
          currentValue={3.5}
          minValue={0}
          maxValue={7.0}
          label="Total Suit Pressure"
          units="psi"
          rectWidth={276}
        />
        <LineGauge
          currentValue={0.0}
          minValue={0}
          maxValue={100}
          label="Helmet Pressure"
          units="psi"
          widthPx={276}
          backgroundWidthPx={260}
        />
      </div>
      {/* Right: Three LineGauges stacked */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          flex: "0 0 auto",
        }}
      >
        <LineGauge
          currentValue={0.0}
          minValue={0}
          maxValue={100}
          label="Suit Pressure Oxygen"
          units="psi"
          widthPx={276}
          backgroundWidthPx={260}
        />
        <LineGauge
          currentValue={3.0}
          minValue={0}
          maxValue={100}
          label="Suit Pressure CO2"
          units="psi"
          widthPx={276}
          backgroundWidthPx={260}
        />
        <LineGauge
          currentValue={0.0}
          minValue={0}
          maxValue={100}
          label="Suit Pressure Other"
          units="psi"
          widthPx={276}
          backgroundWidthPx={260}
        />
      </div>
    </div>
  );
}