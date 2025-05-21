import {create} from 'zustand';

type Gauge = {
    label: string;
    value: number;
    units: string;
    status: string;
    decimals?: number;
}

type Readout = {
    label: string;
    value: number;
    units: string;
}

type LifeSupportData = {
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
}

type TimeAndTempGauge = {
    label: string;
    currentValue: number;
    minValue: number;
    maxValue: number;
    units: string;
    valueDecimals?: number;
    underline?: boolean;
}

type OxygenStorage = {
    storageValue: number;
    storageLabel: string;
    pressureValue: number;
    pressureLabel: string;
    pressureUnits: string;
    pressureMin: number;
    pressureMax: number;
}

type DashboardData = {
    cabinStatus: {
        gauges: Gauge[];
    };
    lifeSupport: LifeSupportData;
    solarAndFans: {
        readouts: Readout[];
    };
    vitals: {
        gauges: Gauge[];
    };
    timeAndTemp: {
        gauges: TimeAndTempGauge[];
    };
    oxygenStorage: {
        primary: OxygenStorage;
        secondary: OxygenStorage;
    };
}

// Default mock data matching page.tsx
const MOCK_DATA: DashboardData = {
    cabinStatus: {
        gauges: [
            { label: "Cabin Temperature", value: 70, units: "°F", status: "Steady" },
            { label: "Cabin Pressure", value: 4.0, units: "psi", decimals: 1, status: "Steady" },
            { label: "Battery Level", value: 40, units: "%", status: "Steady" },
        ]
    },
    lifeSupport: {
        oxygen: {
            tank: 50,
            level: 20,
            pressure: 2997.0
        },
        coolant: {
            tank: 60,
            level: 42,
            pressure: 495
        }
    },
    solarAndFans: {
        readouts: [
            { label: "Solar Panel Efficiency", value: 50, units: "%" },
            { label: "Solar Panel Dust", value: 20, units: "%" },
            { label: "AC Fan PRI", value: 29999, units: "rpm" },
            { label: "AC Fan SEC", value: 29999, units: "rpm" },
        ]
    },
    vitals: {
        gauges: [
            { label: "Heart Rate", value: 97, units: "bpm", status: "Steady" },
            { label: "O₂ Consumption", value: 0.95, units: "psi", decimals: 2, status: "Steady" },
            { label: "CO₂ Production", value: 0.05, units: "psi", decimals: 2, status: "Steady" },
        ]
    },
    timeAndTemp: {
        gauges: [
            {
                label: "Temperature",
                currentValue: 84,
                minValue: 0,
                maxValue: 100,
                units: "F",
                underline: true,
            },
            {
                label: "Oxygen Time Left",
                currentValue: 3600,
                minValue: 0,
                maxValue: 4000,
                units: "sec",
            },
            {
                label: "Battery Time Left",
                currentValue: 3600,
                minValue: 0,
                maxValue: 4000,
                units: "sec",
            },
        ]
    },
    oxygenStorage: {
        primary: {
            storageValue: 10,
            storageLabel: "Oxygen PRI Storage",
            pressureValue: 600,
            pressureLabel: "Oxygen PRI Pressure",
            pressureUnits: "psi",
            pressureMin: 0,
            pressureMax: 1000
        },
        secondary: {
            storageValue: 30,
            storageLabel: "Oxygen SEC Storage",
            pressureValue: 600,
            pressureLabel: "Oxygen SEC Pressure",
            pressureUnits: "psi",
            pressureMin: 0,
            pressureMax: 1000
        }
    }
};

type DashboardStore = {
    ev1Data: DashboardData | null;
    ev2Data: DashboardData | null;
    prData: DashboardData | null;
    setData: (data: { ev1: DashboardData; ev2: DashboardData; pr: DashboardData }) => void;
    fetchData: () => Promise<void>;
    error: string | null;
    // PR values
    prDirection: number;
    prTime: string;
    prHeadlights: boolean;
    setHeadlights: (headlights: boolean) => void;
    // EV1 values
    ev1Direction: number;
    ev1Time: string;
    ev1Headlights: boolean;
    setEv1Headlights: (headlights: boolean) => void;
    // EV2 values
    ev2Direction: number;
    ev2Time: string;
    ev2Headlights: boolean;
    setEv2Headlights: (headlights: boolean) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
    ev1Data: MOCK_DATA,
    ev2Data: MOCK_DATA,
    prData: MOCK_DATA,
    error: null,
    // PR values
    prHeadlights: false,
    setHeadlights: (headlight: boolean) => set({ prHeadlights: headlight }),
    prTime: "00:00:00",
    prDirection: 0,
    // EV1 values
    ev1Headlights: false,
    setEv1Headlights: (headlight: boolean) => set({ ev1Headlights: headlight }),
    ev1Time: "00:17:00",
    ev1Direction: 315,
    // EV2 values
    ev2Headlights: false,
    setEv2Headlights: (headlight: boolean) => set({ ev2Headlights: headlight }),
    ev2Time: "00:14:00",
    ev2Direction: 90,
    setData: (data: { ev1: DashboardData; ev2: DashboardData; pr: DashboardData }) => set({ 
        ev1Data: data.ev1,
        ev2Data: data.ev2,
        prData: data.pr
    }),
    fetchData: async () => {
        try {
            const response = await fetch('/api/dashboard-stats');
            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }
            const data = await response.json();
            set({ 
                ev1Data: data.ev1,
                ev2Data: data.ev2,
                prData: data.pr,
                error: null 
            });
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            set({ error: 'Failed to load dashboard data. Using mock data instead.' });
        }
    },
}));