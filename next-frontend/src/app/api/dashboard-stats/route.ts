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
   
        // Format data to match dashboard structure
        const ev1Data: DashboardData = {
            cabinStatus: {
                gauges: [
                    { 
                        label: "Cabin Temperature", 
                        value: parseFloat(telemetry.temperature.toFixed(2)), 
                        units: "°F", 
                        status: "Steady" 
                    },
                    { 
                        label: "Cabin Pressure", 
                        value: parseFloat(telemetry.suit_pressure_total.toFixed(2)), 
                        units: "psi", 
                        decimals: 1, 
                        status: "Steady" 
                    },
                    { 
                        label: "Battery Level", 
                        value: parseFloat(((telemetry.batt_time_left / 4000) * 100).toFixed(2)),
                        units: "%", 
                        status: "Steady" 
                    },
                ]
            },
            lifeSupport: {
                oxygen: {
                    tank: parseFloat(((telemetry.oxy_pri_storage + telemetry.oxy_sec_storage) / 2).toFixed(2)),
                    level: parseFloat(telemetry.oxy_pri_storage.toFixed(2)),
                    pressure: parseFloat(telemetry.oxy_pri_pressure.toFixed(2))
                },
                coolant: {
                    tank: 100,
                    level: parseFloat(((telemetry.coolant_ml / 1000) * 100).toFixed(2)),
                    pressure: parseFloat(telemetry.coolant_liquid_pressure.toFixed(2))
                }
            },
            solarAndFans: {
                readouts: [
                    { 
                        label: "Solar Panel Efficiency", 
                        value: 50,
                        units: "%" 
                    },
                    { 
                        label: "Solar Panel Dust", 
                        value: 20,
                        units: "%" 
                    },
                    { 
                        label: "AC Fan PRI", 
                        value: parseFloat(telemetry.fan_pri_rpm.toFixed(2)), 
                        units: "rpm" 
                    },
                    { 
                        label: "AC Fan SEC", 
                        value: parseFloat(telemetry.fan_sec_rpm.toFixed(2)), 
                        units: "rpm" 
                    },
                ]
            },
            vitals: {
                gauges: [
                    { 
                        label: "Heart Rate", 
                        value: parseFloat(telemetry.heart_rate.toFixed(2)), 
                        units: "bpm", 
                        status: "Steady" 
                    },
                    { 
                        label: "O₂ Consumption", 
                        value: parseFloat(telemetry.oxy_consumption.toFixed(2)), 
                        units: "psi", 
                        decimals: 2, 
                        status: "Steady" 
                    },
                    { 
                        label: "CO₂ Production", 
                        value: parseFloat(telemetry.co2_production.toFixed(2)), 
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
                        currentValue: parseFloat(telemetry.temperature.toFixed(2)),
                        minValue: 0,
                        maxValue: 100,
                        units: "F",
                        underline: true,
                    },
                    {
                        label: "Oxygen Time Left",
                        currentValue: parseFloat(telemetry.oxy_time_left.toFixed(2)),
                        minValue: 0,
                        maxValue: 4000,
                        units: "sec",
                    },
                    {
                        label: "Battery Time Left",
                        currentValue: parseFloat(telemetry.batt_time_left.toFixed(2)),
                        minValue: 0,
                        maxValue: 4000,
                        units: "sec",
                    },
                ]
            },
            oxygenStorage: {
                primary: {
                    storageValue: parseFloat(((telemetry.oxy_pri_storage / 100) * 100).toFixed(2)),
                    storageLabel: "Oxygen PRI Storage",
                    pressureValue: parseFloat(telemetry.oxy_pri_pressure.toFixed(2)),
                    pressureLabel: "Oxygen PRI Pressure",
                    pressureUnits: "psi",
                    pressureMin: 0,
                    pressureMax: 1000
                },
                secondary: {
                    storageValue: parseFloat(((telemetry.oxy_sec_storage / 100) * 100).toFixed(2)),
                    storageLabel: "Oxygen SEC Storage",
                    pressureValue: parseFloat(telemetry.oxy_sec_pressure.toFixed(2)),
                    pressureLabel: "Oxygen SEC Pressure",
                    pressureUnits: "psi",
                    pressureMin: 0,
                    pressureMax: 1000
                }
            }
        };

        const ev2Data: DashboardData = {
            cabinStatus: {
                gauges: [
                    { 
                        label: "Cabin Temperature", 
                        value: parseFloat(telemetry2.temperature.toFixed(2)), 
                        units: "°F", 
                        status: "Steady" 
                    },
                    { 
                        label: "Cabin Pressure", 
                        value: parseFloat(telemetry2.suit_pressure_total.toFixed(2)), 
                        units: "psi", 
                        decimals: 1, 
                        status: "Steady" 
                    },
                    { 
                        label: "Battery Level", 
                        value: parseFloat(((telemetry2.batt_time_left / 4000) * 100).toFixed(2)),
                        units: "%", 
                        status: "Steady" 
                    },
                ]
            },
            lifeSupport: {
                oxygen: {
                    tank: parseFloat(((telemetry2.oxy_pri_storage + telemetry2.oxy_sec_storage) / 2).toFixed(2)),
                    level: parseFloat(telemetry2.oxy_pri_storage.toFixed(2)),
                    pressure: parseFloat(telemetry2.oxy_pri_pressure.toFixed(2))
                },
                coolant: {
                    tank: 100,
                    level: parseFloat(((telemetry2.coolant_ml / 1000) * 100).toFixed(2)),
                    pressure: parseFloat(telemetry2.coolant_liquid_pressure.toFixed(2))
                }
            },
            solarAndFans: {
                readouts: [
                    { 
                        label: "Solar Panel Efficiency", 
                        value: 50,
                        units: "%" 
                    },
                    { 
                        label: "Solar Panel Dust", 
                        value: 20,
                        units: "%" 
                    },
                    { 
                        label: "AC Fan PRI", 
                        value: parseFloat(telemetry2.fan_pri_rpm.toFixed(2)), 
                        units: "rpm" 
                    },
                    { 
                        label: "AC Fan SEC", 
                        value: parseFloat(telemetry2.fan_sec_rpm.toFixed(2)), 
                        units: "rpm" 
                    },
                ]
            },
            vitals: {
                gauges: [
                    { 
                        label: "Heart Rate", 
                        value: parseFloat(telemetry2.heart_rate.toFixed(2)), 
                        units: "bpm", 
                        status: "Steady" 
                    },
                    { 
                        label: "O₂ Consumption", 
                        value: parseFloat(telemetry2.oxy_consumption.toFixed(2)), 
                        units: "psi", 
                        decimals: 2, 
                        status: "Steady" 
                    },
                    { 
                        label: "CO₂ Production", 
                        value: parseFloat(telemetry2.co2_production.toFixed(2)), 
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
                        currentValue: parseFloat(telemetry2.temperature.toFixed(2)),
                        minValue: 0,
                        maxValue: 100,
                        units: "F",
                        underline: true,
                    },
                    {
                        label: "Oxygen Time Left",
                        currentValue: parseFloat(telemetry2.oxy_time_left.toFixed(2)),
                        minValue: 0,
                        maxValue: 4000,
                        units: "sec",
                    },
                    {
                        label: "Battery Time Left",
                        currentValue: parseFloat(telemetry2.batt_time_left.toFixed(2)),
                        minValue: 0,
                        maxValue: 4000,
                        units: "sec",
                    },
                ]
            },
            oxygenStorage: {
                primary: {
                    storageValue: parseFloat(((telemetry2.oxy_pri_storage / 100) * 100).toFixed(2)),
                    storageLabel: "Oxygen PRI Storage",
                    pressureValue: parseFloat(telemetry2.oxy_pri_pressure.toFixed(2)),
                    pressureLabel: "Oxygen PRI Pressure",
                    pressureUnits: "psi",
                    pressureMin: 0,
                    pressureMax: 1000
                },
                secondary: {
                    storageValue: parseFloat(((telemetry2.oxy_sec_storage / 100) * 100).toFixed(2)),
                    storageLabel: "Oxygen SEC Storage",
                    pressureValue: parseFloat(telemetry2.oxy_sec_pressure.toFixed(2)),
                    pressureLabel: "Oxygen SEC Pressure",
                    pressureUnits: "psi",
                    pressureMin: 0,
                    pressureMax: 1000
                }
            }
        };

        const prData: DashboardData = {
            cabinStatus: {
                gauges: [
                    { 
                        label: "Cabin Temperature", 
                        value: parseFloat(roverTelem.cabinTemperature.toFixed(2)), 
                        units: "°F", 
                        status: "Steady" 
                    },
                    { 
                        label: "Cabin Pressure", 
                        value: parseFloat(roverTelem.cabinPressure.toFixed(2)), 
                        units: "psi", 
                        decimals: 1, 
                        status: "Steady" 
                    },
                    { 
                        label: "Battery Level", 
                        value: parseFloat(roverTelem.batteryLevel.toFixed(2)), 
                        units: "%", 
                        status: "Steady" 
                    },
                ]
            },
            lifeSupport: {
                oxygen: {
                    tank: parseFloat(roverTelem.oxygenTank.toFixed(2)),
                    level: parseFloat(roverTelem.oxygenLevels.toFixed(2)),
                    pressure: parseFloat(roverTelem.oxygenPressure.toFixed(2))
                },
                coolant: {
                    tank: parseFloat(roverTelem.prCoolantTank.toFixed(2)),
                    level: parseFloat(roverTelem.prCoolantLevel.toFixed(2)),
                    pressure: parseFloat(roverTelem.prCoolantPressure.toFixed(2))
                }
            },
            solarAndFans: {
                readouts: [
                    { 
                        label: "Solar Panel Efficiency", 
                        value: parseFloat(roverTelem.solarPanelEfficiency.toFixed(2)), 
                        units: "%" 
                    },
                    { 
                        label: "Solar Panel Dust", 
                        value: parseFloat(roverTelem.solarPanelDustAccum.toFixed(2)), 
                        units: "%" 
                    },
                    { 
                        label: "AC Fan PRI", 
                        value: parseFloat(roverTelem.acFanPri.toFixed(2)), 
                        units: "rpm" 
                    },
                    { 
                        label: "AC Fan SEC", 
                        value: parseFloat(roverTelem.acFanSec.toFixed(2)), 
                        units: "rpm" 
                    },
                ]
            },
            vitals: {
                gauges: [
                    { 
                        label: "Heart Rate", 
                        value: parseFloat(telemetry.heart_rate.toFixed(2)), 
                        units: "bpm", 
                        status: "Steady" 
                    },
                    { 
                        label: "O₂ Consumption", 
                        value: parseFloat(telemetry.oxy_consumption.toFixed(2)), 
                        units: "psi", 
                        decimals: 2, 
                        status: "Steady" 
                    },
                    { 
                        label: "CO₂ Production", 
                        value: parseFloat(telemetry.co2_production.toFixed(2)), 
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
                        currentValue: parseFloat(roverTelem.cabinTemperature.toFixed(2)),
                        minValue: 0,
                        maxValue: 100,
                        units: "F",
                        underline: true,
                    },
                    {
                        label: "Oxygen Time Left",
                        currentValue: parseFloat(telemetry.oxy_time_left.toFixed(2)),
                        minValue: 0,
                        maxValue: 4000,
                        units: "sec",
                    },
                    {
                        label: "Battery Time Left",
                        currentValue: parseFloat(telemetry.batt_time_left.toFixed(2)),
                        minValue: 0,
                        maxValue: 4000,
                        units: "sec",
                    },
                ]
            },
            oxygenStorage: {
                primary: {
                    storageValue: parseFloat(roverTelem.oxygenTank.toFixed(2)),
                    storageLabel: "Oxygen PRI Storage",
                    pressureValue: parseFloat(roverTelem.oxygenPressure.toFixed(2)),
                    pressureLabel: "Oxygen PRI Pressure",
                    pressureUnits: "psi",
                    pressureMin: 0,
                    pressureMax: 1000
                },
                secondary: {
                    storageValue: parseFloat(roverTelem.oxygenTank.toFixed(2)),
                    storageLabel: "Oxygen SEC Storage",
                    pressureValue: parseFloat(roverTelem.oxygenPressure.toFixed(2)),
                    pressureLabel: "Oxygen SEC Pressure",
                    pressureUnits: "psi",
                    pressureMin: 0,
                    pressureMax: 1000
                }
            }
        };

        const response: DashboardResponse = {
            ev1: ev1Data,
            ev2: ev2Data,
            pr: prData
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}