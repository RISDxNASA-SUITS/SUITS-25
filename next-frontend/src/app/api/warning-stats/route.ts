import { NextResponse } from 'next/server';

interface PrTelemetry {
    acHeating: boolean;
    acCooling: boolean;
    co2Scrubber: boolean;
    lightsOn: boolean;
    internalLightsOn: boolean;
    brakes: boolean;
    inSunlight: boolean;
    throttle: number;
    steering: number;
    currentPosX: number;
    currentPosY: number;
    currentPosAlt: number;
    heading: number;
    pitch: number;
    roll: number;
    distanceTraveled: number;
    speed: number;
    surfaceIncline: number;
    oxygenTank: number;
    oxygenPressure: number;
    oxygenLevels: number;
    fanPri: boolean;
    acFanPri: number;
    acFanSec: number;
    cabinPressure: number;
    cabinTemperature: number;
    batteryLevel: number;
    powerConsumptionRate: number;
    solarPanelEfficiency: number;
    externalTemp: number;
    prCoolantLevel: number;
    prCoolantPressure: number;
    prCoolantTank: number;
    radiator: number;
    motorPowerConsumption: number;
    terrainCondition: number;
    solarPanelDustAccum: number;
    missionElapsedTime: number;
    missionPlannedTime: number;
    pointOfNoReturn: number;
    distanceFromBase: number;
    switchDest: boolean;
    destX: number;
}

export async function GET(request: Request) {
    try {
        const response = await fetch(`http://${process.env.NEXT_PUBLIC_JAVA_IP}/telemetry`);
        const data: PrTelemetry = await response.json();
     
        return NextResponse.json(data);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ batteryLevel: 50, error: 'Failed to fetch telemetry data' }, { status: 200 });
    }
}

