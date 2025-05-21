"use client";
import React, { useState } from "react";
import HorizontalTextGaugeCard from "../Cards/HorizontalTextGaugeCard";
import MultiGaugeCard from "../Cards/MultiGaugeCard";
import VerticalTextReadoutCard from "../Cards/VerticalTextReadoutCard";
import MixedGaugeCard from "../Cards/MixedGaugeCard";
import HorizontalLineGaugeCard from "../Cards/HorizontalLineGaugeCard";
import PanelSwitcherEV from "./PanelSwitcher_EV";
import MixedGaugeCard2 from "../Cards/MixedGaugeCard2";
import MultiGaugeCard2 from "../Cards/MultiGaugeCard2";

export default function TelemetryPanelEV() {
    const [selected, setSelected] = useState<"EV" | "Suit">("EV");

    return (
        <div
            className="flex flex-col"
            style={{
                width: 592,
                height: 615,
                position: "absolute",
                top: 565,
                left: 24,
                backgroundColor: "transparent",
                borderRadius: 0,
                paddingBottom: 109,
                boxSizing: "border-box",
            }}
        >
            <PanelSwitcherEV selected={selected} setSelected={setSelected} />

            {selected === "EV" ? (
                <>
                    <div className="flex flex-row gap-6 mt-6">
                        <HorizontalTextGaugeCard
                            gauges={[
                                { label: "Heart Rate", value: 97, units: "bpm", status: "Steady" },
                                { label: "02 Consumption", value: 0.95, units: "psi", decimals: 2, status: "Steady" },
                                { label: "CO2 Production", value: 0.05, units: "psi", status: "Steady" },
                            ]}
                        />
                    </div>

                    <div className="flex flex-row gap-6 mt-6">
                        <HorizontalLineGaugeCard
                            gauges={[
                                {
                                    label: "Temperature",
                                    currentValue: 84,
                                    minValue: 0,
                                    maxValue: 100,
                                    units: "F",
                                    valueDecimals: 0,
                                },
                                {
                                    label: "Oxygen Time Left",
                                    currentValue: 3600,
                                    minValue: 0,
                                    maxValue: 4000,
                                    units: "sec",
                                    valueDecimals: 0,
                                },
                                {
                                    label: "Battery Time Left",
                                    currentValue: 3600,
                                    minValue: 0,
                                    maxValue: 4000,
                                    units: "sec",
                                    valueDecimals: 0,
                                },
                            ]}
                        />
                    </div>

                    <div className="flex flex-row gap-6 mt-6">
                        <MixedGaugeCard
                            storageValue={10}
                            storageLabel="Oxygen PRI Storage"
                            pressureValue={600}
                            pressureLabel="Oxygen PRI Pressure"
                            pressureUnits="psi"
                            pressureMin={0}
                            pressureMax={1000}
                        />
                        <MixedGaugeCard
                            storageValue={30}
                            storageLabel="Oxygen SEC Storage"
                            pressureValue={600}
                            pressureLabel="Oxygen SEC Pressure"
                            pressureUnits="psi"
                            pressureMin={0}
                            pressureMax={1000}
                        />
                    </div>
                </>
            ) : (
                <>
                    {/* MixedGaugeCard2 at x:0, y:70 */}
                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 70,
                        }}
                    >
                        <MixedGaugeCard2 />
                    </div>
                    {/* MultiGaugeCard2 at x:0, y:387 */}
                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 387,
                        }}
                    >
                        <MultiGaugeCard2 />
                    </div>
                </>
            )}
        </div>
    );
}