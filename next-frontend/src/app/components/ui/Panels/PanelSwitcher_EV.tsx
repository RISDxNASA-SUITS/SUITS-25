"use client";
import React from "react";

interface PanelSwitcherEVProps {
  selected: "EV" | "Suit";
  setSelected: (val: "EV" | "Suit") => void;
}

export default function PanelSwitcherEV({ selected, setSelected }: PanelSwitcherEVProps) {
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
        {/* EV Button */}
        <button
          className={`flex-1 h-full flex items-center justify-center text-xl ${
            selected === "EV"
              ? "font-semibold bg-[#2a2640] text-white"
              : "font-normal bg-[#140f28] text-white/80"
          }`}
          style={{
            outline: "none",
            height: "46px",
            width: "296px",
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            borderTop: "1px solid #b7aaff",
            borderBottom: "1px solid #b7aaff",
            borderLeft: "1px solid #b7aaff",
            borderRight: "none",
            boxSizing: "border-box",
            padding: "10px 16px",
            gap: 8,
            background: selected === "EV" ? "#2a2640" : "#140f28",
            color: selected === "EV" ? "#fff" : "rgba(255,255,255,0.8)",
            fontWeight: selected === "EV" ? 600 : 400,
            fontFamily: "IBM Plex Sans, sans-serif",
            fontSize: 20,
            lineHeight: "100%",
            letterSpacing: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontVariantNumeric: "slashed-zero",
          }}
          onClick={() => setSelected("EV")}
        >
          <span
            style={{
              width: 24,
              height: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "IBM Plex Sans, sans-serif",
              fontWeight: selected === "EV" ? 400 : 600,
              fontSize: 20,
              lineHeight: "100%",
              letterSpacing: 0,
              fontVariantNumeric: "slashed-zero",
              textAlign: "center",
              verticalAlign: "middle",
              userSelect: "none",
            }}
          >
            EV
          </span>
        </button>
        {/* Suit Button */}
        <button
          className={`flex-1 h-full flex items-center justify-center text-xl ${
            selected === "Suit"
              ? "font-semibold bg-[#2a2640] text-white"
              : "font-normal bg-[#140f28] text-white/80"
          }`}
          style={{
            outline: "none",
            height: "46px",
            width: "296px",
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            borderTop: "1px solid #b7aaff",
            borderBottom: "1px solid #b7aaff",
            borderRight: "1px solid #b7aaff",
            borderLeft: "none",
            boxSizing: "border-box",
            padding: "10px 16px",
            gap: 8,
            background: selected === "Suit" ? "#2a2640" : "#140f28",
            color: selected === "Suit" ? "#fff" : "rgba(255,255,255,0.8)",
            fontWeight: selected === "Suit" ? 600 : 400,
            fontFamily: "IBM Plex Sans, sans-serif",
            fontSize: 20,
            lineHeight: "100%",
            letterSpacing: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontVariantNumeric: "slashed-zero",
          }}
          onClick={() => setSelected("Suit")}
        >
          <span
            style={{
              width: 37,
              height: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "IBM Plex Sans, sans-serif",
              fontWeight: selected === "Suit" ? 600 : 400,
              fontSize: 20,
              lineHeight: "100%",
              letterSpacing: 0,
              fontVariantNumeric: "slashed-zero",
              textAlign: "center",
              verticalAlign: "middle",
              userSelect: "none",
            }}
          >
            Suit
          </span>
        </button>
      </div>
    </div>
  );
}