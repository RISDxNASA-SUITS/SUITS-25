import React from "react";

interface TextReadoutProps {
  label: string;
  value: number | string;
  units?: string;
  decimals?: number;
}

const TextReadout = ({
  label,
  value,
  units = "%",
  decimals = 0,
}: TextReadoutProps) => {
  const displayValue =
    typeof value === "number" ? value.toFixed(decimals) : value;

  return (
    <div className="bg-[#26233a] rounded-xl p-4 w-80">
      <p className="text-gray-200 text-lg mb-2">{label}</p>
      <p className="text-4xl font-bold text-white">
        {displayValue}
        <span className="ml-1">{units}</span>
      </p>
    </div>
  );
};

export default TextReadout;