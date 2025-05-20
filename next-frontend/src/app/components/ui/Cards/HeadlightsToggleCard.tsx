"use client";
import React, { useState } from "react";

export default function HeadlightsToggleCard() {
  const [on, setOn] = useState(false);

  return (
    <div
      style={{
        width: 568,
        height: 72,
        borderRadius: 16,
        background: "#100A28",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
      }}
    >
      {/* Left: Label */}
      <span
        style={{
          color: "white",
          fontSize: 24,
          fontWeight: 500,
          fontFamily: "IBM Plex Sans, sans-serif",
        }}
      >
        PR Headlights{" "}
        <span style={{ color: "rgba(255,255,255,0.5)" }}>
          | {on ? "On" : "Off"}
        </span>
      </span>
      {/* Right: Toggle */}
      <div
        style={{
          width: 57.33,
          height: 31.27,
          borderRadius: 16,
          background: "transparent",
          border: "1px solid #FFF",
          position: "relative",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => setOn((prev) => !prev)}
      >
        <div
          style={{
            width: 25,
            height: 25,
            borderRadius: "50%",
            background: on ? "#50E3C2" : "#FFF",
            position: "absolute",
            left: on ? 29 : 3,
            top: "50%",
            transform: "translateY(-50%)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            transition: "left 0.2s, background 0.2s",
          }}
        />
      </div>
    </div>
  );
}