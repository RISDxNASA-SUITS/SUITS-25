// import React from 'react';
// import HorizontalTextGaugeCard from '../components/ui/Cards/HorizontalTextGaugeCard';
// import MultiGaugeCard from '../components/ui/Cards/MultiGaugeCard';
// import VerticalTextReadoutCard from '../components/ui/Cards/VerticalTextReadoutCard';
// import HorizontalLineGaugeCard from '../components/ui/Cards/HorizontalLineGaugeCard';
// import MixedGaugeCard from '../components/ui/Cards/MixedGaugeCard';

// export default function DashboardPage() {
//     return (
//         <div className="min-h-screen bg-[#201d33] p-8 flex flex-row items-start gap-8 w-full">
//             {/* Left side: all cards before the first divider */}
//             <div className="flex flex-col gap-8">
//                 <HorizontalTextGaugeCard
//                     gauges={[
//                         { label: "Cabin Temperature", value: 70, units: "°F", status: "Steady" },
//                         { label: "Cabin Pressure", value: 4.0, units: "psi", decimals: 1, status: "Steady" },
//                         { label: "Battery Level", value: 40, units: "%", status: "Steady" },
//                     ]}
//                 />
//                 <div className="flex flex-row gap-8">
//                     <MultiGaugeCard
//                         oxygenTank={50}
//                         oxygenLevel={20}
//                         oxygenPressure={2997.0}
//                         coolantTank={60}
//                         coolantLevel={42}
//                         coolantPressure={495}
//                     />
//                     <VerticalTextReadoutCard
//                         readouts={[
//                             { label: "Solar Panel Efficiency", value: 50, units: "%" },
//                             { label: "Solar Panel Dust", value: 20, units: "%" },
//                             { label: "AC Fan PRI", value: 29999, units: "rpm" },
//                             { label: "AC Fan SEC", value: 29999, units: "rpm" },
//                         ]}
//                     />
//                 </div>
//             </div>
//             {/* First Divider */}
//             <div className="w-px bg-[#393654] self-stretch mx-2" />
//             {/* Middle: second HorizontalTextGaugeCard, HorizontalLineGaugeCard, and MixedGaugeCards */}
//             <div className="flex flex-col gap-8 w-full max-w-3xl">
//                 <HorizontalTextGaugeCard
//                     gauges={[
//                         { label: "Heart Rate", value: 97, units: "bpm", status: "Steady" },
//                         { label: "O₂ Consumption", value: 0.95, units: "psi", decimals: 2, status: "Steady" },
//                         { label: "CO₂ Production", value: 0.05, units: "psi", decimals: 2, status: "Steady" },
//                     ]}
//                 />
//                 <HorizontalLineGaugeCard
//                     gauges={[
//                         {
//                             label: "Temperature",
//                             currentValue: 84,
//                             minValue: 0,
//                             maxValue: 100,
//                             units: "F",
//                             underline: true,
//                         },
//                         {
//                             label: "Oxygen Time Left",
//                             currentValue: 3600,
//                             minValue: 0,
//                             maxValue: 4000,
//                             units: "sec",
//                         },
//                         {
//                             label: "Battery Time Left",
//                             currentValue: 3600,
//                             minValue: 0,
//                             maxValue: 4000,
//                             units: "sec",
//                         },
//                     ]}
//                 />
//                 {/* Two MixedGaugeCards side by side */}
//                 <div className="flex flex-row gap-8">
//                     <MixedGaugeCard
//                         storageValue={10}
//                         storageLabel="Oxygen PRI Storage"
//                         pressureValue={600}
//                         pressureLabel="Oxygen PRI Pressure"
//                         pressureUnits="psi"
//                         pressureMin={0}
//                         pressureMax={1000}
//                     />
//                     <MixedGaugeCard
//                         storageValue={30}
//                         storageLabel="Oxygen SEC Storage"
//                         pressureValue={600}
//                         pressureLabel="Oxygen SEC Pressure"
//                         pressureUnits="psi"
//                         pressureMin={0}
//                         pressureMax={1000}
//                     />
//                 </div>
//             </div>
//             {/* Second Divider */}
//             <div className="w-px bg-[#393654] self-stretch mx-2" />
//             {/* You can add more content here for the next column/section */}
//             <div className="flex flex-col gap-8 w-full max-w-3xl">
//                 <HorizontalTextGaugeCard
//                     gauges={[
//                         { label: "Heart Rate", value: 97, units: "bpm", status: "Steady" },
//                         { label: "O₂ Consumption", value: 0.95, units: "psi", decimals: 2, status: "Steady" },
//                         { label: "CO₂ Production", value: 0.05, units: "psi", decimals: 2, status: "Steady" },
//                     ]}
//                 />
//                 <HorizontalLineGaugeCard
//                     gauges={[
//                         {
//                             label: "Temperature",
//                             currentValue: 84,
//                             minValue: 0,
//                             maxValue: 100,
//                             units: "F",
//                             underline: true,
//                         },
//                         {
//                             label: "Oxygen Time Left",
//                             currentValue: 3600,
//                             minValue: 0,
//                             maxValue: 4000,
//                             units: "sec",
//                         },
//                         {
//                             label: "Battery Time Left",
//                             currentValue: 3600,
//                             minValue: 0,
//                             maxValue: 4000,
//                             units: "sec",
//                         },
//                     ]}
//                 />
//                 {/* Two MixedGaugeCards side by side */}
//                 <div className="flex flex-row gap-8">
//                     <MixedGaugeCard
//                         storageValue={10}
//                         storageLabel="Oxygen PRI Storage"
//                         pressureValue={600}
//                         pressureLabel="Oxygen PRI Pressure"
//                         pressureUnits="psi"
//                         pressureMin={0}
//                         pressureMax={1000}
//                     />
//                     <MixedGaugeCard
//                         storageValue={30}
//                         storageLabel="Oxygen SEC Storage"
//                         pressureValue={600}
//                         pressureLabel="Oxygen SEC Pressure"
//                         pressureUnits="psi"
//                         pressureMin={0}
//                         pressureMax={1000}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }

import React from 'react';
import DashboardPanelLeft from '../components/ui/Panels/DashboardPanel_left';
import DashboardPanelMiddle from '../components/ui/Panels/DashboardPanel_middle';
import DashboardPanelRight from '../components/ui/Panels/DashboardPanel_right';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-[#201d33] p-8 flex flex-row justify-center items-start gap-8">
            <DashboardPanelLeft />
            <DashboardPanelMiddle />
            <DashboardPanelRight />
        </div>
    );
}