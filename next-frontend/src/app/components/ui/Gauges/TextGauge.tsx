"use client";
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
      style={{
        width: 168,
        height: 109,
        borderRadius: 8,
        padding: "4px 8px",
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 152,
          height: "18px",
          textAlign: "center",
          color: "#FFF",
          fontFamily: "IBM Plex Sans, sans-serif",
          fontWeight: 400,
          fontSize: 14,
          lineHeight: "100%",
          letterSpacing: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          verticalAlign: "middle",
          fontVariantNumeric: "slashed-zero",
          marginBottom: 4,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </div>
      <div
        style={{
          width: 152,
          height: "62px",
          textAlign: "center",
          color: "#FFF",
          fontFamily: "IBM Plex Sans, sans-serif",
          fontWeight: 500,
          fontSize: 48, // font sizes/48
          lineHeight: "100%",
          letterSpacing: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontVariantNumeric: "slashed-zero",
          marginBottom: 4,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {displayValue}
        {units}
      </div>
      <div
        data-status={status?.toLowerCase()}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          borderRadius: 20,
          padding: "4px 8px",
          background: "rgba(255,255,255,0.10)",
          width: "fit-content",
          height: "21px",
          marginTop: 4,
        }}
      >
        <span
          style={{
            width: "fit-content",
            height: "13px",
            fontFamily: "IBM Plex Sans, sans-serif",
            fontWeight: 600,
            fontSize: 10,
            lineHeight: "100%",
            letterSpacing: 0,
            verticalAlign: "middle",
            fontVariantNumeric: "slashed-zero",
            color: "#FFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
          }}
        >
          {status}
        </span>
      </div>
    </div>
  );
};

export default TextGauge;