import { create } from "zustand";


type ControlPanelState = "EvDetails" | "AddPin" | "SelectPin" | "AddTag" | "AddVoiceNote" | "AddHazard" | "SelectHazard"
interface PanelStore {
    panelState: ControlPanelState;
    setPanelState: (state: ControlPanelState) => void;
    showPopup: boolean;
    setShowPopup: (showPopup: boolean) => void;
}

export const usePanelStore = create<PanelStore>((set, get) => ({
    panelState  : "EvDetails",
    setPanelState: (state: ControlPanelState) => set({ panelState: state }),
    showPopup: false,
    setShowPopup: (showPopup: boolean) => set({ showPopup }),
}));