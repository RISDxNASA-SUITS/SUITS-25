import { NextResponse } from 'next/server';

interface PRTelemetry {
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

interface TelemetryState {
    time: number;
    batt_time_left: number;
    oxy_pri_storage: number;
    oxy_sec_storage: number;
    oxy_pri_pressure: number;
    oxy_sec_pressure: number;
    oxy_time_left: number;
    heart_rate: number;
    oxy_consumption: number;
    co2_production: number;
    suit_pressure_oxy: number;
    suit_pressure_co2: number;
    suit_pressure_other: number;
    suit_pressure_total: number;
    fan_pri_rpm: number;
    fan_sec_rpm: number;
    helmet_pressure_co2: number;
    scrubber_a_co2_storage: number;
    scrubber_b_co2_storage: number;
    temperature: number;
    coolant_ml: number;
    coolant_gas_pressure: number;
    coolant_liquid_pressure: number;
}

interface ErrorState {
    fan_error: boolean;
    oxy_error: boolean;
    pump_error: boolean;
}

interface UIAState {
    eva1_power: boolean;
    eva1_oxy: boolean;
    eva1_water_supply: boolean;
    eva1_water_waste: boolean;
    eva2_power: boolean;
    eva2_oxy: boolean;
    eva2_water_supply: boolean;
    eva2_water_waste: boolean;
    oxy_vent: boolean;
    depress: boolean;
}

interface DashboardData {
    cabinStatus: {
        gauges: Array<{
            label: string;
            value: number;
            units: string;
            status: string;
            decimals?: number;
        }>;
    };
    lifeSupport: {
        oxygen: {
            tank: number;
            level: number;
            pressure: number;
        };
        coolant: {
            tank: number;
            level: number;
            pressure: number;
        };
    };
    solarAndFans: {
        readouts: Array<{
            label: string;
            value: number;
            units: string;
        }>;
    };
    vitals: {
        gauges: Array<{
            label: string;
            value: number;
            units: string;
            status: string;
            decimals?: number;
        }>;
    };
    timeAndTemp: {
        gauges: Array<{
            label: string;
            currentValue: number;
            minValue: number;
            maxValue: number;
            units: string;
            underline?: boolean;
        }>;
    };
    oxygenStorage: {
        primary: {
            storageValue: number;
            storageLabel: string;
            pressureValue: number;
            pressureLabel: string;
            pressureUnits: string;
            pressureMin: number;
            pressureMax: number;
        };
        secondary: {
            storageValue: number;
            storageLabel: string;
            pressureValue: number;
            pressureLabel: string;
            pressureUnits: string;
            pressureMin: number;
            pressureMax: number;
        };
    };
}

interface DashboardResponse {
    ev1: DashboardData;
    ev2: DashboardData;
    pr: DashboardData;
}

export async function GET(request: Request) {
    try {
        // Fetch all required data from Java backend
        const [telemetry, telemetry2, errorState, uiaState, roverTelem] = await Promise.all([
            fetch(`http://${process.env.NEXT_PUBLIC_JAVA_IP}/ev-telemetry/1`).then(res => res.json()),
            fetch(`http://${process.env.NEXT_PUBLIC_JAVA_IP}/ev-telemetry/2`).then(res => res.json()),
            fetch(`http://${process.env.NEXT_PUBLIC_JAVA_IP}/error`).then(res => res.json()),
            fetch(`http://${process.env.NEXT_PUBLIC_JAVA_IP}/uia`).then(res => res.json()),
            fetch(`http://${process.env.NEXT_PUBLIC_JAVA_IP}/telemetry`).then(res => res.json())
        ]);
   
               
       
    
       

      
                   
       


 

        const response: DashboardResponse = {
            ev1: telemetry,
            ev2: telemetry2,
            pr: roverTelem
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}