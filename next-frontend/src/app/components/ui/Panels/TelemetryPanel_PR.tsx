"use client";
import React from "react";
import HorizontalTextGaugeCard from "../Cards/HorizontalTextGaugeCard";
import MultiGaugeCard from "../Cards/MultiGaugeCard";
import VerticalTextReadoutCard from "../Cards/VerticalTextReadoutCard";
import PanelSwitcherPR from "./PanelSwitcher_PR";

export default function TelemetryPanelPR() {
    return (
        <div
            className="flex flex-col"
            style={{
                width: 592,
                height: 611,
                backgroundColor: "transparent",
                borderRadius: 0,
            }}
        >
            <PanelSwitcherPR />
            
            <div className="flex flex-row gap-6 mt-6">
                <HorizontalTextGaugeCard
                    gauges={[
                        { label: "Cabin Temperature", value: 70, units: "°F", status: "Steady" },
                        { label: "Cabin Pressure", value: 4.0, units: "psi", decimals: 1, status: "Steady" },
                        { label: "Battery Level", value: 40, units: "%", status: "Steady" },
                    ]}
                />
            </div>

            <div className="flex flex-row gap-6 mt-6">
                <MultiGaugeCard
                    oxygenTank={50}
                    oxygenLevel={20}
                    oxygenPressure={2997.0}
                    coolantTank={60}
                    coolantLevel={42}
                    coolantPressure={495}
                />
                <VerticalTextReadoutCard
                    readouts={[
                        { label: "Solar Panel Efficiency", value: 50, units: "%" },
                        { label: "Solar Panel Dust", value: 20, units: "%" },
                        { label: "AC Fan PRI", value: 29999, units: "rpm" },
                        { label: "AC Fan SEC", value: 29999, units: "rpm" },
                    ]}
                />
            </div>
        </div>
    );
}