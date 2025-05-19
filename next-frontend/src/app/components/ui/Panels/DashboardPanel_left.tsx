"use client";
import React from "react";
import DirectionPanel from "./DirectionPanel";
import TimePanel from "./TimePanel";
import LiveVideoPanel from "./LiveVideoPanel";
import TelemetryPanelPR from "./TelemetryPanel_PR";

export default function DashboardPanelLeft() {
    return (
        <div
            className="flex flex-col"
            style={{
                position: "absolute",
                left: 0,
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
                <DirectionPanel degrees={0} filled={true} />
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
                    PR
                </span>
            </div>

            <div
                style={{
                    position: "absolute",
                    left: 457,
                    top: 24,
                }}
            >
                <TimePanel time="00:17:00" />
            </div>

            <div
                style={{
                    position: "absolute",
                    left: 24,
                    top: 105,
                }}
            >
                <LiveVideoPanel coordinate="(D,13)" headlightsOn={true} />
            </div>
            <div
                style={{
                    position: "absolute",
                    left: 24,
                    top: 565,
                }}
            >
                <TelemetryPanelPR />
            </div>
        </div>
    );
}