
import React from 'react';
import CircularGauge from '../components/ui/Gauges/CircularGauge';

export default function DashboardPage() {
    return (
        <div>
            <h1>Dashboard</h1>

            <p>This is the dashboard view for the second screen.</p>

            {/* Add the PressureGauge component here */}
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                <CircularGauge
                    currentValue={50}
                    label="Oxygen Tank"
                />
                <CircularGauge
                    currentValue={60}
                    label="Coolant Tank"
                />
            </div>
        </div>
    );
}