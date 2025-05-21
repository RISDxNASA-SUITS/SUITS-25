"use client";
import React from "react";
import RecordingToggleCard from "../Cards/RecordingToggleCard";
import CoordinateCard from "../Cards/CoordinateCard";
import HeadlightsToggleCard from "../Cards/HeadlightsToggleCard";

interface LiveVideoPanelProps {
  coordinate?: string;
  headlightsOn?: boolean;
}

export default function LiveVideoPanel({
  coordinate = "(D,13)",
  headlightsOn = false,
}: LiveVideoPanelProps) {
  return (
    <div
      style={{
        width: 592,
        height: 444,
        borderRadius: 12,
        background: "white",
        position: "absolute",
        top: 105,
        left: 24,
      }}
      className="overflow-hidden"
    >
      {/* Coordinate Card at x:12, y:12
      <div
        style={{
          position: "absolute",
          left: 12,
          top: 12,
        }}
      >
        <CoordinateCard coordinates={coordinate} />
      </div> */}
      {/* Recording Toggle at x:511, y:12 */}
      <div
        style={{
          position: "absolute",
          left: 511,
          top: 12,
        }}
      >
        <RecordingToggleCard />
      </div>
      {/* Headlights Toggle at x:12, y:360 if headlightsOn */}
      {headlightsOn && (
        <div
          style={{
            position: "absolute",
            left: 12,
            top: 360,
          }}
        >
          <HeadlightsToggleCard />
        </div>
      )}
    </div>
  );
}