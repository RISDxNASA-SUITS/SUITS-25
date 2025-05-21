"use client";
import React, { useState } from "react";

export default function HeadlightsToggleCard() {
  const [on, setOn] = useState(false);

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 12,
        width: 568,
        height: 72,
        borderRadius: 16,
        background: "#100A28",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        gap: 20,
        boxSizing: "border-box",
      }}
    >
      {/* Left: Label */}
      <span
        style={{
          width: 470.67252468509133,
          height: "26px",
          display: "inline-block",
          color: "rgba(255,255,255,1)",
          fontSize: 20,
          fontWeight: 400,
          fontFamily: "IBM Plex Sans, sans-serif",
          lineHeight: "100%",
          letterSpacing: 0,
          verticalAlign: "middle",
          fontVariantNumeric: "slashed-zero",
          transform: "rotate(0.13deg)",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        PR Headlights{" "}
        <span
          style={{
            color: "rgba(255,255,255,0.5)",
            fontFamily: "IBM Plex Sans, sans-serif",
            fontWeight: 400,
            fontSize: 20,
            lineHeight: "100%",
            letterSpacing: 0,
            verticalAlign: "middle",
            fontVariantNumeric: "slashed-zero",
          }}
        >
          | {on ? "On" : "Off"}
        </span>
      </span>
      {/* Right: Toggle */}
      <div
        style={{
          width: 57.32747268676758,
          height: 31.26953125,
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
            background: "#FFF",
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