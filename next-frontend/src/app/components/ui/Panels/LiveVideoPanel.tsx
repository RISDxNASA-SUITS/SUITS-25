/* eslint-disable jsx-a11y/media-has-caption */
"use client";
import React from "react";
import RecordingToggleCard from "../Cards/RecordingToggleCard";
import CoordinateCard from "../Cards/CoordinateCard";
import HeadlightsToggleCard from "../Cards/HeadlightsToggleCard";

interface LiveVideoPanelProps {
  /** Coordinate label in grid form e.g. "(D,13)" */
  coordinate?: string;
  /** Show headlights toggle overlay */
  headlightsOn?: boolean;
  /** Direct video file URL (mp4 / webm).  YouTube embeds need <iframe>. */
  videoUrl?: string;
}

/**
 * Shows a live video feed with overlay controls.
 * NOTE: `videoUrl` **must** be a direct media URL.  For YouTube, render an <iframe> instead.
 */
export default function LiveVideoPanel({
  coordinate = "(D,13)",
  headlightsOn = false,
  videoUrl = "/sample-feed.mp4", // <-- replace with real mp4/webm/HLS source
}: LiveVideoPanelProps) {
  return (
    <div
      style={{
        width: 592,
        height: 444,
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        background: "#000",
      }}
    >
      {/* Video element */}
      <video
        src={videoUrl}
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Coordinate overlay */}
      {/* <div style={{ position: "absolute", left: 12, top: 12 }}>
        <CoordinateCard coordinates={coordinate} />
      </div> */}

      {/* Recording toggle overlay */}
      <div style={{ position: "absolute", right: 12, top: 12 }}>
        <RecordingToggleCard />
      </div>

      {/* Headlights overlay */}
     
        <div style={{ position: "absolute", left: 12, bottom: 12 }}>
          <HeadlightsToggleCard />
        </div>
   
    </div>
  );
}