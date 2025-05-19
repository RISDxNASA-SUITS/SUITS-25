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
            color: "white",
            fontSize: 30,
            fontWeight: 500,
            fontFamily: "IBM Plex Sans, monospace",
            letterSpacing: 2,
            lineHeight: 1,
            width: "100%",
            textAlign: "center",
            display: "block",
          }}
        >
          {time}
        </span>
      </div>
    </div>
  );
}