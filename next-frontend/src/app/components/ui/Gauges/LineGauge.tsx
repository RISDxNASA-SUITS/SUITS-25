import React from "react";

interface LineGaugeProps {
  currentValue: number;
  minValue?: number;
  maxValue?: number;
  label: string;
  units?: string;
  widthPx?: number; // Foreground bar width (default: 160)
  backgroundWidthPx?: number; // Background bar width (default: widthPx)
}

const LineGauge = ({
  currentValue,
  minValue = 0,
  maxValue = 100,
  label,
  units = "%",
  widthPx = 160,
  backgroundWidthPx,
}: LineGaugeProps) => {
  // Clamp and calculate percentage
  const clampedValue = Math.min(Math.max(currentValue, minValue), maxValue);
  const range = maxValue - minValue;
  const percentage = range > 0 ? ((clampedValue - minValue) / range) * 100 : 0;
  const bgWidth = backgroundWidthPx ?? widthPx;

  return (
    <div
      data-property-1="bar"
      className="px-2 py-1 rounded-lg inline-flex flex-col justify-start items-start"
      style={{ width: bgWidth + 32 }} // 32px for padding/margin, adjust as needed
    >
      <div className="self-stretch h-5 inline-flex justify-between items-center">
        <div className="flex-1 justify-center text-white text-sm font-normal font-['IBM_Plex_Sans']">
          {label}
        </div>
      </div>
      <div className="self-stretch justify-start text-white text-2xl font-bold font-['IBM_Plex_Sans']">
        {Math.round(clampedValue)}
        {units}
      </div>
      <div data-property-1="steady" className="self-stretch h-4 relative">
        <div
          className="h-1 left-0 top-[6px] absolute rounded-[5px]"
          style={{ width: bgWidth, backgroundColor: "#534F65" }}
        />
        <div
          className="h-1 left-0 top-[6px] absolute rounded-[5px]"
          style={{
            width: `${(percentage * bgWidth) / 100}px`,
            backgroundColor: "#00CA9A",
          }}
        />
      </div>
    </div>
  );
};

export default LineGauge;