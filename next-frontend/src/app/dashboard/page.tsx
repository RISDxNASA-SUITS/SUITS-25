"use client";
import React from 'react';
import DashboardPanelLeft from '../components/ui/Panels/DashboardPanel_left';
import DashboardPanelMiddle from '../components/ui/Panels/DashboardPanel_middle';
import DashboardPanelRight from '../components/ui/Panels/DashboardPanel_right';

// Mock data structure for fallback
const MOCK_DATA = {
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

export default function DashboardPage() {
    const [dashboardData, setDashboardData] = React.useState(MOCK_DATA);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/dashboard-stats');
                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }
                const data = await response.json();
                setDashboardData(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data. Using mock data instead.');
            }
        };

        fetchData();
        // Set up polling every 5 seconds
        const interval = setInterval(fetchData, 5000);

        return () => clearInterval(interval);
    }, []);

    if (error) {
        console.warn(error);
    }

    return (
        <div className="min-h-screen bg-[#201d33] p-8 flex flex-row justify-center items-start gap-8">
            <DashboardPanelLeft />
            <DashboardPanelMiddle />
            <DashboardPanelRight />
        </div>
    );
}