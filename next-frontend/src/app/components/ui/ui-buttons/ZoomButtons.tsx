"use client";

import React from "react";

type ZoomButtonsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
};

const ZoomButtons = ({ onZoomIn, onZoomOut }: ZoomButtonsProps) => {
    return (
      <div className="zoom-buttons-container">
        <button onClick={onZoomIn} aria-label="Zoom In">
          <img src="/logo/zoom-in.svg" alt="zoom in" />
        </button>
        <button onClick={onZoomOut} aria-label="Zoom Out">
          <img src="/logo/zoom-out.svg" alt="zoom out" />
        </button>
      </div>
    );
  };
  
  export default ZoomButtons;