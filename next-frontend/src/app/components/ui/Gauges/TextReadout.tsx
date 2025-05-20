"use client";
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
  units = "",
  decimals = 0,
}: TextReadoutProps) => {
  const displayValue =
    typeof value === "number" ? value.toFixed(decimals) : value;

  return (
    <div
      data-property-1="number"
      className="self-stretch px-2 py-1 rounded-lg inline-flex flex-col justify-start items-start"
    >
      <div className="self-stretch h-5 inline-flex justify-between items-center">
        <div className="flex-1 justify-center text-white text-sm font-normal font-['IBM_Plex_Sans']">
          {label}
        </div>
      </div>
      <div className="self-stretch justify-start text-white text-2xl font-bold font-['IBM_Plex_Sans']">
        {displayValue}
        {units && <span className="ml-1">{units}</span>}
      </div>
    </div>
  );
};

export default TextReadout;