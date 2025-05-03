import React from "react";

interface LineGaugeProps {
  currentValue: number;
  minValue?: number;
  maxValue?: number;
  label: string;
  units?: string;
}

const LineGauge = ({
  currentValue,
  minValue = 0,
  maxValue = 100,
  label,
  units = "%",
}: LineGaugeProps) => {
  // Clamp and calculate percentage
  const clampedValue = Math.min(Math.max(currentValue, minValue), maxValue);
  const range = maxValue - minValue;
  const percentage = range > 0 ? ((clampedValue - minValue) / range) * 100 : 0;

  return (
    <div className="bg-[#2E2B50] rounded-xl p-4 w-72">
      <p className="text-gray-200 text-lg mb-2">{label}</p>
      <p className="text-3xl font-bold text-white mb-2">
        {Math.round(clampedValue)}
        {units}
      </p>
      <div className="w-full h-2 rounded-full bg-[#393654]">
        <div
          className="h-2 rounded-full bg-[#50E3C2] transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default LineGauge;