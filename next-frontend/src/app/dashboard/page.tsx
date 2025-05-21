"use client";
import React from 'react';
import DashboardPanelLeft from '../components/ui/Panels/DashboardPanel_left';
import DashboardPanelMiddle from '../components/ui/Panels/DashboardPanel_middle';
import DashboardPanelRight from '../components/ui/Panels/DashboardPanel_right';
import { useDashboardStore } from "@/app/hooks/dashboardHook";
import PRPanel from "./prPanel";
import { EvPanel } from './evPanel';

export default function DashboardPage() {
    const {fetchData, prData, ev1Data, ev2Data } = useDashboardStore();

    React.useEffect(() => {
        fetchData();
        // Set up polling every 5 seconds
        const interval = setInterval(fetchData, 5000);

        return () => clearInterval(interval);
    }, [fetchData]);

  

    return (
        <div className="min-h-screen bg-[#201d33] p-8 grid grid-cols-3 justify-center items-start gap-4">
            <div className="h-full">
                <PRPanel prData={prData} />
            </div>
            <div className="h-full">
                <EvPanel evData={ev1Data} name="EV1"/>
            </div>
            <div className="h-full">
                <EvPanel evData={ev2Data} name="EV2"/>
            </div>
            {/* <DashboardPanelLeft />
            <DashboardPanelMiddle />
            <DashboardPanelRight /> */}
        </div>
    );
}