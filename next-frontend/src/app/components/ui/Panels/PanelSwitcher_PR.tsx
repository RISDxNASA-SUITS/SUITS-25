"use client";
import React from "react";

export default function PanelSwitcherPR() {
  // Static: PR is always selected
  return (
    <div
      style={{
        width: 592,
        height: "46px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
      }}
    >
      <div
        style={{
          width: 592,
          height: 46,
          display: "flex",
          borderRadius: 20,
          border: "1px solid #b7aaff",
          overflow: "hidden",
          background: "transparent",
        }}
      >
        {/* PR Button (selected) */}
        <button
          style={{
            height: "46px",
            width: "296px",
            outline: "none",
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            borderTop: "1px solid #b7aaff",
            borderBottom: "1px solid #b7aaff",
            borderLeft: "1px solid #b7aaff",
            borderRight: "none",
            boxSizing: "border-box",
            padding: "10px 16px",
            gap: 8,
            background: "#2a2640",
            color: "#fff",
            fontWeight: 600,
            fontFamily: "IBM Plex Sans, sans-serif",
            fontSize: 20,
            lineHeight: "100%",
            letterSpacing: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontVariantNumeric: "slashed-zero",
          }}
        >
          <span
            style={{
              width: 27,
              height: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "IBM Plex Sans, sans-serif",
              fontWeight: 600,
              fontSize: 20,
              lineHeight: "100%",
              letterSpacing: 0,
              fontVariantNumeric: "slashed-zero",
              textAlign: "center",
              verticalAlign: "middle",
              userSelect: "none",
            }}
          >
            PR
          </span>
        </button>
        {/* LTV Button (not selected) */}
        <button
          style={{
            height: "46px",
            width: "296px",
            outline: "none",
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            borderTop: "1px solid #b7aaff",
            borderRight: "1px solid #b7aaff",
            borderBottom: "1px solid #b7aaff",
            borderLeft: "none",
            boxSizing: "border-box",
            padding: "10px 16px",
            gap: 8,
            background: "#140f28",
            color: "rgba(255,255,255,0.8)",
            fontWeight: 400,
            fontFamily: "IBM Plex Sans, sans-serif",
            fontSize: 20,
            lineHeight: "100%",
            letterSpacing: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontVariantNumeric: "slashed-zero",
          }}
        >
          <span
            style={{
              width: 33,
              height: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "IBM Plex Sans, sans-serif",
              fontWeight: 400,
              fontSize: 20,
              lineHeight: "100%",
              letterSpacing: 0,
              fontVariantNumeric: "slashed-zero",
              textAlign: "center",
              verticalAlign: "middle",
              userSelect: "none",
            }}
          >
            LTV
          </span>
        </button>
      </div>
    </div>
  );
}