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
    className="p-2 bg-white/10 rounded-2xl inline-flex justify-start items-center gap-6"
    style={{ width: 386, height: 392 }}
  >
    {/* Left: Circular Gauges */}
    <div className="w-40 self-stretch flex flex-col justify-between items-center gap-4">
      <CircularGauge
        currentValue={oxygenTank}
        minValue={0}
        maxValue={100}
        label="Oxygen Tank"
        units="%"
        rectWidth={168}
      />
      <CircularGauge
        currentValue={coolantTank}
        minValue={0}
        maxValue={100}
        label="Coolant Tank"
        units="%"
        rectWidth={168}
      />
    </div>
    {/* Right: Line Gauges */}
    <div className="flex-1 self-stretch flex flex-col justify-between items-start gap-2">
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