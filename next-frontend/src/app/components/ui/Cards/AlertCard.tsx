"use client";
import React, { useState } from "react";

interface AlertCardProps {
  alertText: string;
  actionText1: string;
  actionText2: string;
  onAction1: () => void;
  onAction2: () => void;
  type?: "warning" | "confirmation" | "generic";
  buttons?: boolean;
}

const getBackgroundColor = (color: "warning" | "confirmation" | "generic" = "generic") => {
  switch (color) {
    case "warning":
      return "#6A3B3B";
    case "confirmation":
      return "#365F56";
    default:
      return "#2F2D39";
  }
};

export default function AlertCard({
  alertText,
  actionText1,
  actionText2,
  onAction1,
  onAction2,
  type = "generic",
  buttons = true,
}: AlertCardProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const bgColor = getBackgroundColor(type);

  return (
    <div
      style={{
        width: 700,
        height: buttons ? 141 : 79,
        borderRadius: 16,
        background: bgColor,
        border: `2px solid ${bgColor}`,
        position: "relative",
        boxSizing: "border-box",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
      }}
    >
      {/* Close (X) button */}
      <button
        onClick={() => setVisible(false)}
        style={{
          position: "absolute",
          top: 10,
          right: 18,
          background: "none",
          border: "none",
          color: "#FFF",
          fontSize: 28,
          cursor: "pointer",
          zIndex: 2,
        }}
        aria-label="Close"
      >
        ×
      </button>
      {/* Back arrow */}
      <span
        style={{
          position: "absolute",
          left: 18,
          top: 12,
          color: "#FFF",
          fontSize: 32,
          fontWeight: 300,
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        &#8592;
      </span>
      {/* Alert text */}
      <div
        style={{
          width: "100%",
          textAlign: "center",
          marginTop: 10,
          marginBottom: buttons ? 12 : 0,
          flex: buttons ? undefined : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "#FFF",
            fontSize: 32,
            fontWeight: 600,
            fontFamily: "IBM Plex Sans, sans-serif",
            letterSpacing: 1,
          }}
        >
          {alertText}
        </span>
      </div>
      {/* Buttons */}
      {buttons && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            marginTop: 0,
          }}
        >
          {/* Action Button 1 */}
          <button
            onClick={onAction1}
            style={{
              width: 200,
              height: 44,
              borderRadius: 10,
              border: "2px solid #FFFFFF", // White border
              background: "transparent",
              color: "#FFF",
              fontSize: 22,
              fontWeight: 500,
              fontFamily: "IBM Plex Sans, sans-serif",
              cursor: "pointer",
              marginRight: 8,
              transition: "background 0.15s, color 0.15s",
            }}
          >
            {actionText1}
          </button>
          {/* Action Button 2 */}
          <button
            onClick={onAction2}
            style={{
              width: 200,
              height: 44,
              borderRadius: 10,
              border: "2px solid #FFFFFF", // White border
              background: "transparent",
              color: "#FFF",
              fontSize: 22,
              fontWeight: 500,
              fontFamily: "IBM Plex Sans, sans-serif",
              cursor: "pointer",
              marginLeft: 8,
              transition: "background 0.15s, color 0.15s",
            }}
          >
            {actionText2}
          </button>
        </div>
      )}
    </div>
  );
}