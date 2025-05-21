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
      style={{
        width: 164,
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
          width: 148,
          height: "18px",
          color: "#FFF",
          fontFamily: "IBM Plex Sans, sans-serif",
          fontWeight: 400,
          fontSize: 14,
          lineHeight: "100%",
          letterSpacing: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          verticalAlign: "middle",
          fontVariantNumeric: "slashed-zero",
          marginBottom: 2,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </div>
      <div
        style={{
          width: 148,
          height: "31px",
          color: "#FFF",
          fontFamily: "IBM Plex Sans, sans-serif",
          fontWeight: 700,
          fontSize: 24, // font sizes/24
          lineHeight: "100%",
          letterSpacing: 0,
          display: "flex",
          alignItems: "center",
          fontVariantNumeric: "slashed-zero",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {displayValue}
        {units && <span style={{ marginLeft: 4 }}>{units}</span>}
      </div>
    </div>
  );
};

export default TextReadout;