"use client";
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
  widthPx = 185,
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
      style={{
        width: 185,
        minHeight: 0,
        height: "auto",
        borderRadius: 8,
        padding: "4px 8px",
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 174,
          height: "18px",
          display: "flex",
          alignItems: "center",
          marginBottom: 2,
          color: "#FFF",
          fontFamily: "IBM Plex Sans, sans-serif",
          fontWeight: 400,
          fontSize: 14,
          lineHeight: "100%",
          letterSpacing: 0,
          verticalAlign: "middle",
          fontVariantNumeric: "slashed-zero",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </div>
      <div
        style={{
          width: 174,
          height: "31px",
          display: "flex",
          alignItems: "center",
          marginBottom: 2,
          color: "#FFF",
          fontFamily: "IBM Plex Sans, sans-serif",
          fontWeight: 700,
          fontSize: 24,
          lineHeight: "100%",
          letterSpacing: 0,
          fontVariantNumeric: "slashed-zero",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {Math.round(clampedValue)}
        {units}
      </div>
      <div
        style={{
          width: 174,
          height: 16,
          position: "relative",
          marginTop: 4,
        }}
      >
        <div
          style={{
            height: 8,
            borderRadius: 5,
            background: "#534F65",
            width: bgWidth,
            position: "absolute",
            top: 4,
            left: 0,
          }}
        />
        <div
          style={{
            height: 8,
            borderRadius: 5,
            background: "#00CA9A",
            width: `${(percentage * bgWidth) / 100}px`,
            position: "absolute",
            top: 4,
            left: 0,
            transition: "width 0.3s",
          }}
        />
      </div>
    </div>
  );
};

export default LineGauge;