"use client";
import React from "react";

interface CoordinateCardProps {
  coordinates: string;
}

export default function CoordinateCard({ coordinates }: CoordinateCardProps) {
  return (
    <div
      style={{
        width: 56,
        height: 28,
        borderRadius: 14,
        background: "#100A28",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          color: "white",
          fontSize: 14,
          fontWeight: 550,
          fontFamily: "IBM Plex Sans, sans-serif",
          letterSpacing: 1,
        }}
      >
        {coordinates}
      </span>
    </div>
  );
}