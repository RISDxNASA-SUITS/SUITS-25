import CloseButton from "@/app/components/ui/ui-buttons/CloseButton";
import SubTabButton from "@/app/components/ui/Tabs/SubTabButton";
import {useState} from "react";
import {PoiStore} from "@/app/hooks/PoiStore";
import PrimaryButton from "@/app/components/ui/ui-buttons/PrimaryButton";
import {usePanelStore} from "@/app/hooks/panelStore";

type SelectLabelProps = {
    onClose?: () => void;

    compact?: boolean;
}

type SubTab = "Rock" | "Terrain" | "Category" | ""


export const AddTag = ({ onClose=()=>{},  compact = false } : SelectLabelProps) => {
    const [selectedSubTab, setSelectedSubTab] = useState<SubTab>("Rock");
    const {setPanelState:setControlPanelState} = usePanelStore()
    const { selectedPoiId, pois, updateTag, hazardPois } = PoiStore();
    const normalPoi = pois.find(p => p.id === selectedPoiId)
    const selectedHazardPoi = hazardPois.find(p => p.id === selectedPoiId);
    const selectedPoi = normalPoi ?? selectedHazardPoi
    console.log("SELECTED POI IS", selectedPoi)

    console.log(selectedPoi?.tags)

    const tagOptions: Record<SubTab, Record<string, string[]>> = {
        Rock: {
            Color: ["Black", "Gray", "Light-toned"],
            Diameter: ["5cm", "10cm", "15cm"],
            Depth: ["0.1kg", "0.2kg", "0.3kg"],
            Roughness: ["Fine", "Medium", "Coarse"],
        },
        Terrain: {
            Slope: ["flat", "steep"],
            Texture: ["grainy", "smooth", "rocky"],
        },
        Category: {
            Type: ["sedimentary", "igneous", "metamorphic"],
        },
        "": {}
    };

    const options = tagOptions[selectedSubTab];

    return (
        <div className={"flex flex-col justify-between h-full"}>
            <div className={`flex flex-col ${compact ? "gap-2" : "gap-9"}`}>
                {!compact && <div className={"flex justify-between"}>
                    <div className={`flex ${compact ? "gap-2" : "gap-4"}`}>
                        <button onClick={() => setControlPanelState("AddPin")}>
                            <img src={"/logo/back.svg"} alt={"back button"} />
                        </button>
                        <p className={"font-bold text-xl"}>Add Tag</p>
                    </div>
                    <CloseButton onClose={onClose}/>
                </div>}

                <div className={"flex gap-3"}>
                    {(["Rock", "Terrain", "Category"] as const).map(tab => (
                        <SubTabButton
                            key={tab}
                            selected={tab}
                            isSelected={tab === selectedSubTab}
                            onSelect={() => setSelectedSubTab(tab)}
                            className="flex-none px-4 py-2 rounded-md text-sm"
                        />
                    ))}
                </div>

                {/* Subcategory & label UI */}
                <div className={`flex flex-col ${compact ? "gap-2" : "gap-8"}`}>
                    {Object.entries(options).map(([subCategory, labels]) => (
                        <div key={subCategory} className={"flex flex-col gap-2"}>
                            <p className="text-white font-medium">{subCategory}</p>
                            <div className="flex gap-2 flex-wrap mt-1">
                                {labels.map(label => {
                                    const selected = selectedPoi?.tags?.includes(label);
                                    return (
                                        <button
                                            key={label}
                                            className={`px-4 py-2 rounded-full border text-sm ${
                                                selected ? "bg-white text-black border-white" : "text-white border-white"
                                            }`}
                                            onClick={() => updateTag(selectedPoiId, label)}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {!compact && <div className={"flex"}>
                <PrimaryButton logo={"/logo/checkmark.svg"} onClick={() => setControlPanelState("AddPin")}>Save</PrimaryButton>
            </div>}
        </div>
    );
};