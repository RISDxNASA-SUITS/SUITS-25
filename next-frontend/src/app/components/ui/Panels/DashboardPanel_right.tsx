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
                borderRadius: 0,
            }}
        >
            
            {/* Direction Panel */}
            <div
                style={{
                    position: "absolute",
                    left: 24,
                    top: 28,
                }}
            >
                <DirectionPanel degrees={ev2Direction} filled={false} />
            </div>
            
            {/* PR Text Box */}
            <div
                style={{
                    position: "absolute",
                    left: 94,
                    top: 32,
                    width: 343,
                    height: 42,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <span
                    style={{
                        color: "white",
                        fontSize: 32,
                        fontWeight: 550,
                        fontFamily: "IBM Plex Sans, sans-serif",
                        letterSpacing: 2,
                        width: "100%",
                        textAlign: "left",
                        display: "block",
                    }}
                >
                    EV2
                </span>
            </div>

            <div
                style={{
                    position: "absolute",
                    left: 457,
                    top: 24,
                }}
            >
                <TimePanel time={ev2Time} />
            </div>
            
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