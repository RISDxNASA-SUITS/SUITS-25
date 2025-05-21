"use client";
import React from 'react';

interface CircularGaugeProps {
  currentValue: number;
  minValue?: number;
  maxValue?: number;
  label: string;
  units?: string;
  rectWidth?: number; // Width of the rectangle container
}

const CircularGauge = ({
  currentValue,
  minValue = 0,
  maxValue = 100,
  label,
  units = '%',
  rectWidth = 192,
}: CircularGaugeProps) => {
  // --- Percentage Calculation ---
  const clampedValue = Math.min(Math.max(currentValue, minValue), maxValue);
  const range = maxValue - minValue;
  let percentage = 0;
  if (range > 0) {
    percentage = ((clampedValue - minValue) / range) * 100;
  } else if (clampedValue >= maxValue) {
    percentage = 100;
  }
  percentage = Math.min(Math.max(percentage, 0), 100);

  // --- SVG & Arc Constants ---
  const circleSize = 120;
  const stroke = 12;
  const radius = (circleSize / 2) - (stroke / 2);
  const center = circleSize / 2;
  const circumference = 2 * Math.PI * radius;
  const rotation = 135;
  const arcAngle = 270;

  // --- Arc Calculations ---
  const backgroundArcFactor = arcAngle / 360;
  const backgroundArcLength = circumference * backgroundArcFactor;
  const backgroundGapLength = circumference * (1 - backgroundArcFactor);

  const foregroundArcFactor = ((clampedValue - minValue) / (maxValue - minValue)) * arcAngle / 360;
  const foregroundArcLength = circumference * foregroundArcFactor;
  const foregroundGapLength = circumference * (1 - foregroundArcFactor);

  const arcOffset = foregroundArcLength - (percentage / 100) * backgroundArcLength;

  return (
    <div
      className="flex items-center justify-center relative"
      style={{
        width: 168,
        height: 168,
        background: "transparent",
        borderRadius: 8,
      }}
    >
      <div
        className="flex flex-col items-center justify-center relative"
        style={{
          width: circleSize,
          height: circleSize,
        }}
      >
        <svg width={circleSize} height={circleSize} viewBox={`0 0 ${circleSize} ${circleSize}`}>
          {/* Background Circle Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#3E3951"
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${backgroundArcLength} ${backgroundGapLength}`}
            transform={`rotate(${rotation} ${center} ${center})`}
          />
          {/* Foreground Circle Arc (Progress Indicator) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#50E3C2"
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${foregroundArcLength} ${foregroundGapLength}`}
            strokeDashoffset={arcOffset}
            transform={`rotate(${rotation} ${center} ${center})`}
          />
        </svg>
        {/* Centered label and value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-xs text-white break-words max-w-[90px] leading-tight">{label}</p>
          <p className="text-2xl font-medium text-white">{Math.round(currentValue)}{units}</p>
        </div>
        {/* "Steady" status indicator at the bottom */}
        <div className="absolute bottom-2 bg-[#3E3951] px-2 py-0.5 rounded-full text-xs font-semibold">
          Steady
        </div>
      </div>
    </div>
  );
};

export default CircularGauge;