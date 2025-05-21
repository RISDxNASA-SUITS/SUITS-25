"use client";
import React from "react";
import LineGauge from "../Gauges/LineGauge";
import TextReadout from "../Gauges/TextReadout";

export default function MultiGaugeCard2() {
  return (
    <div
      style={{
        width: 592,
        minHeight: 0,
        height: "auto", // Hug height
        top: 317,
        borderRadius: 16,
        background: "#28233E",
        position: "relative",
        padding: 8,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "row",
        gap: 24,
      }}
    >
      {/* Left: LineGauge */}
      <div
        style={{
          flex: "0 0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 200,
        }}
      >
        <LineGauge
          currentValue={60}
          minValue={0}
          maxValue={100}
          label="Coolant Storage"
          units="%"
          widthPx={184}
          backgroundWidthPx={168}
        />
      </div>
      {/* Right: TextReadouts in two columns */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 24,
          flex: 1,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <TextReadout label="Scrubber CO2 Storage A" value={0} units="%" />
          <TextReadout label="Scrubber CO2 Storage B" value={0} units="%" />
          <TextReadout label="Coolant Liquid Pressure" value={100} units="psi" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <TextReadout label="Fan PRI RPM" value={20000} units="rpm" />
          <TextReadout label="Fan Sec RPM" value={20000} units="rpm" />
          <TextReadout label="Coolant Gas Pressure" value={0} units="psi" />
        </div>
      </div>
    </div>
  );
}