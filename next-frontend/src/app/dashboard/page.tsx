import React from 'react';
import PressureGauge from '../components/ui/Gauges/PressureGauge';

export default function DashboardPage() {
    return (
        <div>
            <h1>Dashboard</h1>
            <p>This is the dashboard view for the second screen.</p>

            {/* Add the PressureGauge component here */}
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                <PressureGauge
                    currentValue={3.5}
                    minValue={0}
                    maxValue={5}
                />
            </div>
        </div>
    );
}