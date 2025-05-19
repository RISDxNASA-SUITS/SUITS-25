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
    <div
      data-property-1="default"
      className="w-40 h-28 px-2 py-1 rounded-lg inline-flex flex-col justify-center items-center"
    >
      <div className="self-stretch text-center justify-center text-white text-sm font-normal font-['IBM_Plex_Sans']">
        {label}
      </div>
      <div className="self-stretch text-center justify-start text-white text-5xl font-medium font-['IBM_Plex_Sans']">
        {displayValue}
        {units}
      </div>
      <div
        data-status={status?.toLowerCase()}
        className="px-2 py-1 bg-white/10 rounded-[20px] inline-flex justify-center items-center gap-1"
      >
        <div className="justify-center text-white text-[10px] font-semibold font-['IBM_Plex_Sans']">
          {status}
        </div>
      </div>
    </div>
  );
};

export default TextGauge;