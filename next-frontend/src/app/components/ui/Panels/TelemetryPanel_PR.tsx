"use client";
import React from "react";
import HorizontalTextGaugeCard from "../Cards/HorizontalTextGaugeCard";
import MultiGaugeCard from "../Cards/MultiGaugeCard";
import VerticalTextReadoutCard from "../Cards/VerticalTextReadoutCard";
import PanelSwitcherPR from "./PanelSwitcher_PR";

export default function TelemetryPanelPR({data}: {data: any}) {
    return (
        <div
            className="flex flex-col"
            style={{
                width: 592,
                height: 611,
                position: "absolute",
                top: 565,
                left: 24,
                backgroundColor: "transparent",
                borderRadius: 0,
                paddingBottom: 40,
                boxSizing: "border-box",
            }}
        >
            <PanelSwitcherPR />
            
            <div className="flex flex-row gap-6 mt-6">
                <HorizontalTextGaugeCard
                    gauges={data.cabinStatus.gauges}
                />
            </div>

            <div className="flex flex-row gap-6 mt-6">
                <MultiGaugeCard
                    oxygenTank={data.lifeSupport.oxygen.tank}
                    oxygenLevel={data.lifeSupport.oxygen.level}
                    oxygenPressure={data.lifeSupport.oxygen.pressure}
                    coolantTank={data.lifeSupport.coolant.tank}
                    coolantLevel={data.lifeSupport.coolant.level}
                    coolantPressure={data.lifeSupport.coolant.pressure}
                />
                <VerticalTextReadoutCard
                    readouts={data.solarAndFans.readouts}
                />
            </div>
        </div>
    );
}