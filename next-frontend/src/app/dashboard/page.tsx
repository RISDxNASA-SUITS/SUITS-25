"use client";
import React from 'react';
import DashboardPanelLeft from '../components/ui/Panels/DashboardPanel_left';
import DashboardPanelMiddle from '../components/ui/Panels/DashboardPanel_middle';
import DashboardPanelRight from '../components/ui/Panels/DashboardPanel_right';
import { useDashboardStore } from '../hooks/dashboardHook';


export default function DashboardPage() {
    const { fetchData, error } = useDashboardStore();

    React.useEffect(() => {
        fetchData();
        // Set up polling every 5 seconds
        const interval = setInterval(fetchData, 5000);

        return () => clearInterval(interval);
    }, [fetchData]);

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