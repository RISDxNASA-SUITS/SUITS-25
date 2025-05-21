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
import { useDashboardStore } from "../../../hooks/dashboardHook";

interface TelemetryPanelEVProps {
    type: 'ev1' | 'ev2';
}

export default function TelemetryPanelEV({ type }: TelemetryPanelEVProps) {
    const [selected, setSelected] = useState<"EV" | "Suit">("EV");
    const { ev1Data, ev2Data } = useDashboardStore();
    const data = type === 'ev1' ? ev1Data : ev2Data;

    if (!data) return null;

    return (
        <div
            className="flex flex-col"
            style={{
                width: 592,
                height: 611,
                backgroundColor: "transparent",
                borderRadius: 0,
                position: "relative",
            }}
        >
            <PanelSwitcherEV selected={selected} setSelected={setSelected} />

            {selected === "EV" ? (
                <>
                    <div className="flex flex-row gap-6 mt-6">
                        <HorizontalTextGaugeCard
                            gauges={data.vitals.gauges}
                        />
                    </div>

                    <div className="flex flex-row gap-6 mt-6">
                        <HorizontalLineGaugeCard
                            gauges={data.timeAndTemp.gauges}
                        />
                    </div>

                    <div className="flex flex-row gap-6 mt-6">
                        <MixedGaugeCard
                            storageValue={data.oxygenStorage.primary.storageValue}
                            storageLabel={data.oxygenStorage.primary.storageLabel}
                            pressureValue={data.oxygenStorage.primary.pressureValue}
                            pressureLabel={data.oxygenStorage.primary.pressureLabel}
                            pressureUnits={data.oxygenStorage.primary.pressureUnits}
                            pressureMin={data.oxygenStorage.primary.pressureMin}
                            pressureMax={data.oxygenStorage.primary.pressureMax}
                        />
                        <MixedGaugeCard
                            storageValue={data.oxygenStorage.secondary.storageValue}
                            storageLabel={data.oxygenStorage.secondary.storageLabel}
                            pressureValue={data.oxygenStorage.secondary.pressureValue}
                            pressureLabel={data.oxygenStorage.secondary.pressureLabel}
                            pressureUnits={data.oxygenStorage.secondary.pressureUnits}
                            pressureMin={data.oxygenStorage.secondary.pressureMin}
                            pressureMax={data.oxygenStorage.secondary.pressureMax}
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
                    {/* MultiGaugeCard2 at x:0, y:317 */}
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