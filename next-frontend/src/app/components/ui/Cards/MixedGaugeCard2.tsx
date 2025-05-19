import React from "react";
import CircularGauge from "../Gauges/CircularGauge";
import LineGauge from "../Gauges/LineGauge";

export default function MixedGaugeCard2() {
  return (
    <div
      style={{
        width: 592,
        height: 291,
        borderRadius: 20,
        background: "#28233E", // Updated background color
        position: "relative",
      }}
    >
      {/* CircularGauge at x:0, y:0 */}
      <div
        style={{
          position: "absolute",
          left: 8,
          top: 8,
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
      </div>
      {/* LineGauge at x:0, y:199 */}
      <div
        style={{
          position: "absolute",
          left: 8,
          top: 207,
        }}
      >
        <LineGauge
          currentValue={0.00}
          minValue={0}
          maxValue={100}
          label="Helmet Pressure"
          units="psi"
          widthPx={276}
          backgroundWidthPx={260}
        />
      </div>
      {/* LineGauge at x:308, y:15.5 */}
      <div
        style={{
          position: "absolute",
          left: 308,
          top: 15.5,
        }}
      >
        <LineGauge
          currentValue={0.00}
          minValue={0}
          maxValue={100}
          label="Suit Pressure Oxygen"
          units="psi"
          widthPx={276}
          backgroundWidthPx={260}
        />
      </div>
      {/* LineGauge at x:308, y:107.5 */}
      <div
        style={{
          position: "absolute",
          left: 308,
          top: 107.5,
        }}
      >
        <LineGauge
          currentValue={3.00}
          minValue={0}
          maxValue={100}
          label="Suit Pressure CO2"
          units="psi"
          widthPx={276}
          backgroundWidthPx={260}
        />
      </div>
      {/* LineGauge at x:308, y:199.5 */}
      <div
        style={{
          position: "absolute",
          left: 308,
          top: 199.5,
        }}
      >
        <LineGauge
          currentValue={0.00}
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
}``