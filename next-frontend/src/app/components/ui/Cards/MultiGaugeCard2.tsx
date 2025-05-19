"use client";
import React from "react";
import LineGauge from "../Gauges/LineGauge";
import TextReadout from "../Gauges/TextReadout";

export default function MultiGaugeCard2() {
  return (
    <div
      style={{
        width: 592,
        height: 228,
        borderRadius: 16,
        background: "#28233E",
        position: "relative",
      }}
    >
      {/* LineGauge at x:16, y:73.5 */}
      <div
        style={{
          position: "absolute",
          left: 16,
          top: 73.5,
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
      {/* TextReadouts */}
      <div style={{ position: "absolute", left: 216, top: 8 }}>
        <TextReadout label="Scrubber CO2 Storage A" value={0} units="%" />
      </div>
      <div style={{ position: "absolute", left: 216, top: 84 }}>
        <TextReadout label="Scrubber CO2 Storage B" value={0} units="%" />
      </div>
      <div style={{ position: "absolute", left: 216, top: 160 }}>
        <TextReadout label="Coolant Liquid Pressure" value={100} units="psi" />
      </div>
      <div style={{ position: "absolute", left: 404, top: 8 }}>
        <TextReadout label="Fan PRI RPM" value={20000} units="rpm" />
      </div>
      <div style={{ position: "absolute", left: 404, top: 84 }}>
        <TextReadout label="Fan Sec RPM" value={20000} units="rpm" />
      </div>
      <div style={{ position: "absolute", left: 404, top: 160 }}>
        <TextReadout label="Coolant Gas Pressure" value={0} units="psi" />
      </div>
    </div>
  );
}