"use client";
import React, { useState } from "react";

export default function RecordingToggleCard() {
  const [on, setOn] = useState(false);

  return (
    <div
      style={{
        width: 69,
        height: 28,
        borderRadius: 14,
        background: "#100A28",
        display: "flex",
        alignItems: "center",
        position: "relative",
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
          position: "absolute",
          left: 4,
          top: 4,
          transition: "background 0.2s",
        }}
      />
      {/* REC text */}
      <span
        style={{
          position: "absolute",
          left: 34,
          top: 5,
          color: on ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.5)",
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "IBM Plex Sans, sans-serif",
          letterSpacing: 1,
          lineHeight: "18px",
          transition: "color 0.2s",
        }}
      >
        REC
      </span>
    </div>
  );
}