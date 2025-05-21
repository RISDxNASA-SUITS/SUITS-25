"use client";
import React, { useState } from "react";

export default function RecordingToggleCard() {
  const [on, setOn] = useState(false);

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: 511,
        minWidth: 69,
        width: "fit-content",
        height: 28,
        borderRadius: 16,
        background: "#100A28",
        display: "flex",
        alignItems: "center",
        padding: "4px 8px 4px 4px",
        gap: 10,
        boxSizing: "border-box",
        cursor: "pointer",
      }}
      onClick={() => setOn((prev) => !prev)}
    >
      {/* White circle, red if on */}
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: on ? "#FF3B3B" : "#FFF",
          transition: "background 0.2s",
          marginRight: 0,
        }}
      />
      {/* REC text */}
      <span
        style={{
          width: 27,
          height: "18px",
          fontFamily: "IBM Plex Sans, sans-serif",
          fontWeight: 600,
          fontSize: 14,
          lineHeight: "100%",
          letterSpacing: 0,
          verticalAlign: "middle",
          fontVariantNumeric: "slashed-zero",
          color: on ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "color 0.2s",
          userSelect: "none",
        }}
      >
        REC
      </span>
    </div>
  );
}