import { create } from "zustand";

const MOCK_EV_DATA: evTelem = {
    time: 0,
    batt_time_left: 100,
    oxy_pri_storage: 100,
    oxy_sec_storage: 100,
    oxy_pri_pressure: 14.7,
    oxy_sec_pressure: 14.7,
    oxy_time_left: 480,
    heart_rate: 72,
    oxy_consumption: 0.5,
    co2_production: 0.3,
    suit_pressure_oxy: 14.7,
    suit_pressure_co2: 0.04,
    suit_pressure_other: 0.1,
    suit_pressure_total: 14.84,
    fan_pri_rpm: 2000,
    fan_sec_rpm: 2000,
    helmet_pressure_co2: 0.04,
    scrubber_a_co2_storage: 0,
    scrubber_b_co2_storage: 0,
    temperature: 37,
    coolant_ml: 1000,
    coolant_gas_pressure: 14.7,
    coolant_liquid_pressure: 14.7
};

const MOCK_PR_DATA: prTelem = {
    acHeating: false,
    acCooling: false,
    co2Scrubber: true,
    lightsOn: false,
    internalLightsOn: true,
    brakes: false,
    inSunlight: true,
    throttle: 0,
    steering: 0,
    currentPosX: 0,
    currentPosY: 0,
    currentPosAlt: 0,
    heading: 0,
    pitch: 0,
    roll: 0,
    distanceTraveled: 0,
    speed: 0,
    surfaceIncline: 0,
    oxygenTank: 100,
    oxygenPressure: 14.7,
    oxygenLevels: 100,
    fanPri: true,
    acFanPri: 2000,
    acFanSec: 2000,
    cabinPressure: 14.7,
    cabinTemperature: 22,
    batteryLevel: 100,
    powerConsumptionRate: 0,
    solarPanelEfficiency: 100,
    externalTemp: 20,
    prCoolantLevel: 100,
    prCoolantPressure: 14.7,
    prCoolantTank: 100,
    radiator: 0,
    motorPowerConsumption: 0,
    terrainCondition: 0,
    solarPanelDustAccum: 0,
    missionElapsedTime: 0,
    missionPlannedTime: 480,
    pointOfNoReturn: 240,
    distanceFromBase: 0,
    switchDest: false,
    destX: 0
};

type dashboardStore = {
    ev1Data: evTelem;
    ev2Data: evTelem;
    prData: prTelem;
    fetchData: () => Promise<void>;
}

export type evTelem = {
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

export type prTelem = {
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


export const useDashboardStore = create<dashboardStore>((set, get) => ({
    ev1Data: MOCK_EV_DATA,
    ev2Data: MOCK_EV_DATA,
    prData: MOCK_PR_DATA,
    fetchData: async () => {
        const response = await fetch("/api/dashboard-stats");
        const data = await response.json();
        set({ ev1Data: data.ev1, ev2Data: data.ev2, prData: data.pr });
    },
}))