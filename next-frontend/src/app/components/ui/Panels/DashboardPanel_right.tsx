"use client";
import React from "react";
import DirectionPanel from "./DirectionPanel";
import TimePanel from "./TimePanel";
import LiveVideoPanel from "./LiveVideoPanel";
import TelemetryPanelEV from "./TelemetryPanel_EV";
import { useDashboardStore } from "../../../hooks/dashboardHook";

export default function DashboardPanelRight() {
    const { ev2Direction, ev2Time, ev2Headlights } = useDashboardStore();
    
    return (
        <div
            className="flex flex-col"
            style={{
                position: "absolute",
                left: 1280,
                top: 0,
                width: 640,
                height: 1200,
                backgroundColor: "#100A28", // midnight-purple
                borderLeft: "1px solid #28233E",
                borderRadius: 0,
                boxSizing: "border-box",
                gap: 40,
            }}
        >
            {/* Top Row: DirectionPanel, EV2 Text Box, TimePanel */}
            <div
                style={{
                    width: 640,
                    minHeight: 0,
                    height: "106px",
                    padding: 24,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        width: 50,
                        height: 50,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <DirectionPanel degrees={90} filled={false} />
                </div>
                <div
                    style={{
                        width: 343,
                        height: 42,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                    }}
                >
                    <span
                        style={{
                            width: "100%",
                            height: "42px",
                            color: "#FFF",
                            fontFamily: "IBM Plex Sans, sans-serif",
                            fontWeight: 500,
                            fontSize: 32,
                            lineHeight: "100%",
                            letterSpacing: 0,
                            display: "flex",
                            alignItems: "center",
                            verticalAlign: "middle",
                            fontVariantNumeric: "slashed-zero",
                            textAlign: "left",
                            userSelect: "none",
                        }}
                    >
                        EV2
                    </span>
                </div>
                <div
                    style={{
                        width: 100,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                    }}
                >
                    <TimePanel time="00:14:00" />
                </div>
            </div>
            {/* Live Video Panel */}
            <div
                style={{
                    position: "absolute",
                    left: 24,
                    top: 105,
                }}
            >
                <LiveVideoPanel coordinate="(O,19)" headlightsOn={ev2Headlights} />
            </div>
            <div
                style={{
                    position: "absolute",
                    left: 24,
                    top: 565,
                }}
            >
                <TelemetryPanelEV type="ev2" />
            </div>
        </div>
    );
}