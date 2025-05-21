"use client";
import React from "react";

interface CoordinateCardProps {
  coordinates: string;
}

export default function CoordinateCard({ coordinates }: CoordinateCardProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        minWidth: 56,
        width: "fit-content",
        height: 28,
        borderRadius: 16,
        background: "#100A28",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4px 8px",
        gap: 10,
        boxSizing: "border-box",
      }}
    >
      <span
        style={{
          color: "rgba(255,255,255,1)",
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "IBM Plex Sans, sans-serif",
          letterSpacing: 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        title={coordinates}
      >
        {coordinates}
      </span>
    </div>
  );
}