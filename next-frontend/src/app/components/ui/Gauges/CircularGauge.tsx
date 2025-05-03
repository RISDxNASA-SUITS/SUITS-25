import React from 'react';

// Define the properties expected by the PressureGauge component
interface CircularGaugeProps {
  currentValue: number; // The current value to display on the gauge
  minValue?: number;     // The minimum value the gauge can represent
  maxValue?: number;     // The maximum value the gauge can represent
  label: string;        // The label to display on the gauge
  units?: string;      // The units to display (default: '%')
}

const CircularGauge = ({
  currentValue,
  minValue = 0,
  maxValue = 100,
  label,
  units = '%',
}: CircularGaugeProps) => {
  // --- Percentage Calculation ---
  // Ensure the current value doesn't go below the minimum or above the maximum
  const clampedValue = Math.min(Math.max(currentValue, minValue), maxValue);

  // Calculate the total range of the gauge
  const range = maxValue - minValue;

  // Calculate the percentage of the gauge that should be filled
  let percentage = 0; // Default to 0%
  if (range > 0) {
    // Calculate percentage based on the clamped value's position within the range
    percentage = ((clampedValue - minValue) / range) * 100;
  } else if (clampedValue >= maxValue) {
    // Handle edge case where minValue equals maxValue; if value is at max, show 100%
    percentage = 100;
  }

  // Ensure the final percentage is strictly between 0 and 100
  percentage = Math.min(Math.max(percentage, 0), 100);
  // --- End of Percentage Calculation ---

  // --- SVG & Arc Constants ---
  const containerSize = 192; // Pixel size of the square container (matches w-48/h-48)
  const stroke = 18;         // Width of the gauge's arc line
  // Radius of the center line of the arc stroke
  const radius = (containerSize / 2) - (stroke / 2);
  const center = containerSize / 2; // Center coordinate for the SVG circles
  const circumference = 2 * Math.PI * radius; // Full circumference of the circle defined by the radius
  const rotation = 135;      // Starting rotation angle (degrees) for the arcs (0 is 3 o'clock)

  const arcAngle = 270;      // The total angle (degrees) the gauge arc should span

  // --- Background Arc Calculations ---
  // Fraction of the circle the background arc covers (e.g., 270/360 = 0.75)
  const backgroundArcFactor = arcAngle / 360;
  // The visible length of the background arc stroke
  const backgroundArcLength = circumference * backgroundArcFactor;
  // The length of the gap in the background arc stroke
  const backgroundGapLength = circumference * (1 - backgroundArcFactor);

  // --- Foreground Arc Calculations (Based on current code, might need adjustment for desired behavior) ---
  // Fraction of the *total* circle the foreground should fill based on value (this calculation seems complex)
  const foregroundArcFactor = ((currentValue - minValue) / (maxValue - minValue)) * arcAngle / 360;
  // The calculated length of the foreground arc based on its factor
  const foregroundArcLength = circumference * foregroundArcFactor;
  // The calculated gap length for the foreground arc
  const foregroundGapLength = circumference * (1 - foregroundArcFactor);

  // Offset for the foreground arc (this calculation seems complex and might not produce the intended "fill" effect)
  const arcOffset = foregroundArcLength - (percentage / 100) * backgroundArcLength;
  // --- End of Arc Calculations ---

  return (
    // Outer container div: sets size, background, shape, and centers content
    <div className="w-48 h-48 flex flex-col items-center justify-center relative text-white bg-[#12102A] rounded-full">
      {/* SVG container for drawing the gauge arcs */}
      <svg width="100%" height="100%" viewBox={`0 0 ${containerSize} ${containerSize}`}>
        {/* Background Circle Arc */}
        <circle
          cx={center} // X-coordinate of the center
          cy={center} // Y-coordinate of the center
          r={radius}  // Radius of the arc
          stroke="#2E2B50" // Color of the background arc
          strokeWidth={stroke} // Width of the arc line
          fill="none" // Makes the circle hollow
          // Defines the dash pattern: draw 'backgroundArcLength', then gap 'backgroundGapLength'
          strokeDasharray={`${backgroundArcLength} ${backgroundGapLength}`}
          // Rotates the starting point of the dash array
          transform={`rotate(${rotation} ${center} ${center})`}
        />
        {/* Foreground Circle Arc (Progress Indicator) */}
        <circle
          cx={center} // X-coordinate of the center
          cy={center} // Y-coordinate of the center
          r={radius}  // Radius of the arc
          stroke="#50E3C2" // Color of the foreground arc
          strokeWidth={stroke} // Width of the arc line
          fill="none" // Makes the circle hollow
          // Defines the dash pattern for the foreground (based on current complex calculation)
          strokeDasharray={`${foregroundArcLength} ${foregroundGapLength}`}
          // Offsets the start of the dash pattern (based on current complex calculation)
          strokeDashoffset={arcOffset}
          // Rotates the starting point identically to the background
          transform={`rotate(${rotation} ${center} ${center})`}
        />
      </svg>
      {/* Container for the text labels, absolutely positioned to overlay the center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {/* Label text */}
        <p className="text-xs text-gray-300">{label}</p>
        {/* Current value display */}
        <p className="text-4xl font-medium">{Math.round(currentValue)}{units}</p>
      </div>
      {/* "Steady" status indicator at the bottom */}
      <div className="absolute bottom-3 bg-[#2E2B50] px-3 py-1 rounded-full text-sm font-semibold italic">
        Steady
      </div>
    </div>
  );
};

export default CircularGauge;
