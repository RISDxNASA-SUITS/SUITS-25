import React from "react";

interface DirectionPanelProps {
  degrees: number;
  filled?: boolean;
}

export default function DirectionPanel({ degrees, filled = true }: DirectionPanelProps) {
  return (
    <div
      style={{
        width: 50,
        height: 50,
        borderRadius: "50%",
        border: "1px solid #E4FCFF",
        background: "#412D91",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width={38}
        height={38}
        viewBox="0 0 38 38"
        style={{
          transform: `rotate(${degrees}deg)`,
          display: "block",
        }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Centered left-pointing arrow */}
        {filled ? (
          <polygon
            points="12,19 28,10 23,19 28,28"
            fill="#E4FCFF"
          />
        ) : (
          <polygon
            points="12,19 28,10 23,19 28,28"
            fill="none"
            stroke="#9D89FF"
            strokeWidth={3}
            strokeLinejoin="round"
          />
        )}
      </svg>
    </div>
  );
}