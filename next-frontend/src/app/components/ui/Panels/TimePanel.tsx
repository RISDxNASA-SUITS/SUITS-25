"use client";
import React from "react";

interface TimePanelProps {
  time: string; // Format: "HH:MM:SS"
}

export default function TimePanel({ time }: TimePanelProps) {
  return (
    <div
      style={{
        width: 159,
        height: 58,
        borderRadius: 12,
        background: "#1B133E",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px 12px",
        gap: 10,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 135,
          height: 42,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            width: 135,
            height: 42,
            color: "white",
            fontSize: 32,
            fontWeight: 500,
            fontFamily: "IBM Plex Sans, sans-serif",
            letterSpacing: 0,
            lineHeight: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            verticalAlign: "middle",
            fontVariantNumeric: "slashed-zero",
            textAlign: "center",
            userSelect: "none",
          }}
        >
          {time}
        </span>
      </div>
    </div>
  );
}