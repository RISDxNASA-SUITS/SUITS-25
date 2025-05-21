"use client";
import React from "react";

interface VerticalTextReadoutCardProps {
  readouts: {
    label: string;
    value: number | string;
    units?: string;
    decimals?: number;
  }[];
}

const VerticalTextReadoutCard = ({ readouts }: VerticalTextReadoutCardProps) => (
  <div
    style={{
      width: 180,
      height: 392,
      position: "absolute",
      left: 412,
      gap: 40,
      borderRadius: 16,
      padding: 8,
      background: "rgba(255,255,255,0.10)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      boxSizing: "border-box",
    }}
  >
    {readouts.map((r) => (
      <div
        key={r.label}
        style={{
          width: "100%",
          padding: "4px 8px",
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            height: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <div
            style={{
              flex: 1,
              color: "#FFF",
              fontSize: 14,
              fontWeight: 400,
              fontFamily: "IBM Plex Sans, sans-serif",
            }}
          >
            {r.label}
          </div>
        </div>
        <div
          style={{
            width: "100%",
            color: "#FFF",
            fontSize: 24,
            fontWeight: 700,
            fontFamily: "IBM Plex Sans, sans-serif",
            display: "flex",
            alignItems: "center",
          }}
        >
          {typeof r.value === "number" && r.decimals !== undefined
            ? r.value.toLocaleString(undefined, {
                minimumFractionDigits: r.decimals,
                maximumFractionDigits: r.decimals,
              })
            : r.value}
          {r.units && (
            <span style={{ marginLeft: 4 }}>{r.units}</span>
          )}
        </div>
      </div>
    ))}
  </div>
);

export default VerticalTextReadoutCard;