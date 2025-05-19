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
  <div className="bg-[#26233a] rounded-2xl p-8 flex flex-row gap-12 w-fit">
    {/* Left: Circular Gauges */}
    <div className="flex flex-col gap-16 justify-center">
      <CircularGauge currentValue={oxygenTank} label="Oxygen Tank" />
      <CircularGauge currentValue={coolantTank} label="Coolant Tank" />
    </div>
    {/* Right: Line Gauges */}
    <div className="flex flex-col gap-8 justify-center min-w-[260px]">
      <div>
        <LineGauge currentValue={oxygenLevel} label="Oxygen Levels" units="%" />
      </div>
      <div>
        <LineGauge
          currentValue={oxygenPressure}
          minValue={0}
          maxValue={3000}
          label="Oxygen Pressure"
          units="psi"
        //   valueDecimals={2}
        />
      </div>
      <div>
        <LineGauge
          currentValue={coolantLevel}
          label="Coolant Level"
          units="L"
        />
      </div>
      <div>
        <LineGauge
          currentValue={coolantPressure}
          label="Coolant Pressure"
          units="psi"
        />
      </div>
    </div>
  </div>
);

export default MultiGaugeCard;