import {create} from "zustand/react";

type ltvTelemetry = {
    cabinTemperature: number
    cabinPressure:number
    batteryLevel: number
    oxygenLevel: number
    oxygenTank:number
    oxygenPressure:number
    coolantTank:number
    coolantLevel:number
    coolantPressure:number
    solarPanelEfficiency:number
    solarPanelDust:number
    acFanPri:number
    acFanSec:number
}


interface statsStore {
    time: number
    ltvTelemetry: ltvTelemetry
    load: () => void

}


export const useStatsStore = create<statsStore>((set,get) => ({
    time: 0,
    ltvTelemetry: {
        cabinTemperature: 0,
        cabinPressure: 0,
        batteryLevel: 0,
        oxygenLevel: 0,
        oxygenTank: 0,
        oxygenPressure: 0,
        coolantTank: 0,
        coolantLevel: 0,
        coolantPressure: 0,
        solarPanelEfficiency: 0,
        solarPanelDust: 0,
        acFanPri: 0,
        acFanSec: 0
    },
    load: (): void => {

    }
}))
