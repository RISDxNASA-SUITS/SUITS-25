import React from "react";

interface PanelSwitcherEVProps {
  selected: "EV" | "Suit";
  setSelected: (val: "EV" | "Suit") => void;
}

export default function PanelSwitcherEV({ selected, setSelected }: PanelSwitcherEVProps) {
  return (
    <div className="w-full flex justify-center items-center mt-2">
      <div
        className="w-[592px] h-[46px] flex rounded-2xl border border-[#b7aaff] overflow-hidden"
        style={{ background: "transparent" }}
      >
        {/* EV Button */}
        <button
          className={`flex-1 h-full flex items-center justify-center text-xl font-semibold ${
            selected === "EV"
              ? "bg-[#2a2640] text-white border-r border-[#b7aaff]"
              : "bg-[#140f28] text-white/80 font-normal border-r border-[#b7aaff]"
          }`}
          style={{ outline: "none" }}
          onClick={() => setSelected("EV")}
        >
          EV
        </button>
        {/* Suit Button */}
        <button
          className={`flex-1 h-full flex items-center justify-center text-xl ${
            selected === "Suit"
              ? "font-semibold bg-[#2a2640] text-white"
              : "font-normal bg-[#140f28] text-white/80"
          }`}
          style={{ outline: "none" }}
          onClick={() => setSelected("Suit")}
        >
          Suit
        </button>
      </div>
    </div>
  );
}