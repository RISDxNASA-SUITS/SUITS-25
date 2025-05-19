import React from "react";

export default function PanelSwitcherPR() {
  // Static: PR is always selected
  return (
    <div className="w-full flex justify-center items-center mt-2">
      <div
        className="w-[592px] h-[46px] flex rounded-2xl border border-[#b7aaff] overflow-hidden"
        style={{ background: "transparent" }}
      >
        {/* PR Button (selected) */}
        <button
          className="flex-1 h-full flex items-center justify-center text-xl font-semibold bg-[#2a2640] text-white border-r border-[#b7aaff]"
          style={{ outline: "none" }}
        >
          PR
        </button>
        {/* LTV Button (not selected) */}
        <button
          className="flex-1 h-full flex items-center justify-center text-xl font-normal bg-[#140f28] text-white/80"
          style={{ outline: "none" }}
        >
          LTV
        </button>
      </div>
    </div>
  );
}