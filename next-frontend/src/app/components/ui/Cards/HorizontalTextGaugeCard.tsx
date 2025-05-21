"use client";
import React from "react";
import TextGauge from "../Gauges/TextGauge";

interface HorizontalTextGaugeCardProps {
  gauges: {
    label: string;
    value: number | string;
    units?: string;
    decimals?: number;
    status?: string;
  }[];
}

const HorizontalTextGaugeCard = ({ gauges }: HorizontalTextGaugeCardProps) => (
  <div
    style={{
      width: 592,
      minHeight: 0,
      height: "auto",
      borderRadius: 16,
      background: "rgba(255,255,255,0.10)",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 8,
      gap: 8,
      boxSizing: "border-box",
    }}
  >
    {gauges.map((g) => (
      <div
        key={g.label}
        style={{
          width: 160,
          minHeight: 0,
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
            width: "100%",
            textAlign: "center",
            color: "#FFF",
            fontSize: 14,
            fontWeight: 400,
            fontFamily: "IBM Plex Sans, sans-serif",
            marginBottom: 4,
          }}
        >
          {g.label}
        </div>
        <div
          style={{
            width: "100%",
            textAlign: "center",
            color: "#FFF",
            fontSize: 40,
            fontWeight: 500,
            fontFamily: "IBM Plex Sans, sans-serif",
            marginBottom: 4,
            lineHeight: "100%",
          }}
        >
          {typeof g.value === "number" && g.decimals !== undefined
            ? g.value.toFixed(g.decimals)
            : g.value}
          {g.units}
        </div>
        <div
          style={{
            padding: "4px 8px",
            background: "rgba(255,255,255,0.10)",
            borderRadius: 20,
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
            marginTop: 4,
          }}
        >
          <div
            style={{
              color: "#FFF",
              fontSize: 10,
              fontWeight: 600,
              fontFamily: "IBM Plex Sans, sans-serif",
            }}
          >
            {g.status}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default HorizontalTextGaugeCard;