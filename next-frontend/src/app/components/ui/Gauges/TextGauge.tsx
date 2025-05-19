import React from "react";

interface TextGaugeProps {
  label: string;
  value: number | string;
  units?: string;
  decimals?: number;
  status?: string;
}

const TextGauge = ({
  label,
  value,
  units = "",
  decimals = 1,
  status = "Steady",
}: TextGaugeProps) => {
  // Format the value with the specified number of decimals if it's a number
  const displayValue =
    typeof value === "number" ? value.toFixed(decimals) : value;

  return (
    <div className="bg-[#26233a] rounded-2xl p-8 flex flex-col items-center w-[260px]">
      <p className="text-gray-200 text-lg mb-2">{label}</p>
      <p className="text-5xl font-bold text-white mb-4">
        {displayValue}
        <span className="text-3xl font-normal ml-1">{units}</span>
      </p>
      <div className="bg-[#393654] px-4 py-1 rounded-full text-base font-semibold italic text-white">
        {status}
      </div>
    </div>
  );
};

export default TextGauge;