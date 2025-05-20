import { NextResponse } from 'next/server';

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

export async function GET(request: Request) {
    try {
        // Fetch all required data from Java backend
        const [telemetry, errorState, uiaState] = await Promise.all([
            fetch(`http://${process.env.NEXT_PUBLIC_JAVA_IP}/ev-telemetry/1`).then(res => res.json()),
            fetch(`http://${process.env.NEXT_PUBLIC_JAVA_IP}/error`).then(res => res.json()),
            fetch(`http://${process.env.NEXT_PUBLIC_JAVA_IP}/uia`).then(res => res.json())
        ]);
   
        // Format data to match dashboard structure
        const dashboardData = {
            cabinStatus: {
                gauges: [
                    { 
                        label: "Cabin Temperature", 
                        value: telemetry.temperature, 
                        units: "°F", 
                        status: "Steady" 
                    },
                    { 
                        label: "Cabin Pressure", 
                        value: telemetry.suit_pressure_total, 
                        units: "psi", 
                        decimals: 1, 
                        status: "Steady" 
                    },
                    { 
                        label: "Battery Level", 
                        value: (telemetry.batt_time_left / 4000) * 100, // Convert to percentage
                        units: "%", 
                        status: "Steady" 
                    },
                ]
            },
            lifeSupport: {
                oxygen: {
                    tank: (telemetry.oxy_pri_storage + telemetry.oxy_sec_storage) / 2,
                    level: telemetry.oxy_pri_storage,
                    pressure: telemetry.oxy_pri_pressure
                },
                coolant: {
                    tank: 100, // Max tank capacity
                    level: (telemetry.coolant_ml / 1000) * 100, // Convert to percentage
                    pressure: telemetry.coolant_liquid_pressure
                }
            },
            solarAndFans: {
                readouts: [
                    { 
                        label: "Solar Panel Efficiency", 
                        value: 50, // Not available in telemetry
                        units: "%" 
                    },
                    { 
                        label: "Solar Panel Dust", 
                        value: 20, // Not available in telemetry
                        units: "%" 
                    },
                    { 
                        label: "AC Fan PRI", 
                        value: telemetry.fan_pri_rpm, 
                        units: "rpm" 
                    },
                    { 
                        label: "AC Fan SEC", 
                        value: telemetry.fan_sec_rpm, 
                        units: "rpm" 
                    },
                ]
            },
            vitals: {
                gauges: [
                    { 
                        label: "Heart Rate", 
                        value: telemetry.heart_rate, 
                        units: "bpm", 
                        status: "Steady" 
                    },
                    { 
                        label: "O₂ Consumption", 
                        value: telemetry.oxy_consumption, 
                        units: "psi", 
                        decimals: 2, 
                        status: "Steady" 
                    },
                    { 
                        label: "CO₂ Production", 
                        value: telemetry.co2_production, 
                        units: "psi", 
                        decimals: 2, 
                        status: "Steady" 
                    },
                ]
            },
            timeAndTemp: {
                gauges: [
                    {
                        label: "Temperature",
                        currentValue: telemetry.temperature,
                        minValue: 0,
                        maxValue: 100,
                        units: "F",
                        underline: true,
                    },
                    {
                        label: "Oxygen Time Left",
                        currentValue: telemetry.oxy_time_left,
                        minValue: 0,
                        maxValue: 4000,
                        units: "sec",
                    },
                    {
                        label: "Battery Time Left",
                        currentValue: telemetry.batt_time_left,
                        minValue: 0,
                        maxValue: 4000,
                        units: "sec",
                    },
                ]
            },
            oxygenStorage: {
                primary: {
                    storageValue: (telemetry.oxy_pri_storage / 100) * 100, // Convert to percentage
                    storageLabel: "Oxygen PRI Storage",
                    pressureValue: telemetry.oxy_pri_pressure,
                    pressureLabel: "Oxygen PRI Pressure",
                    pressureUnits: "psi",
                    pressureMin: 0,
                    pressureMax: 1000
                },
                secondary: {
                    storageValue: (telemetry.oxy_sec_storage / 100) * 100, // Convert to percentage
                    storageLabel: "Oxygen SEC Storage",
                    pressureValue: telemetry.oxy_sec_pressure,
                    pressureLabel: "Oxygen SEC Pressure",
                    pressureUnits: "psi",
                    pressureMin: 0,
                    pressureMax: 1000
                }
            }
        };

        return NextResponse.json(dashboardData);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}