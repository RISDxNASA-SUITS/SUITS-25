import CloseButton from "@/app/components/ui/ui-buttons/CloseButton";
import SubTabButton from "@/app/components/ui/Tabs/SubTabButton";
import {useState} from "react";
import {PoiStore} from "@/app/hooks/PoiStore";
import PrimaryButton from "@/app/components/ui/ui-buttons/PrimaryButton";

type SelectLabelProps = {
    onClose: () => void;
    setControlPanelState: (state: "EvDetails" | "AddPin" | "SelectPin" |"SelectStation" | "AddTag" ) => void;
}

type SubTab = "Rock" | "Terrain" | "Category" | ""


export const AddTag = ({ onClose, setControlPanelState } : SelectLabelProps) => {
    const [selectedSubTab, setSelectedSubTab] = useState<SubTab>("Rock");
    const { selectedPoiId, pois, updateTag } = PoiStore();
    const selectedPoi = pois.find(p => p.id === selectedPoiId);

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
            <div className={"flex flex-col gap-9"}>
                <div className={"flex justify-between"}>
                    <div className={"flex gap-4"}>
                        <button onClick={() => setControlPanelState("AddPin")}>
                            <img src={"/logo/back.svg"} alt={"back button"} />
                        </button>
                        <p className={"font-bold text-xl"}>Add Tag</p>
                    </div>
                    <CloseButton onClose={onClose}/>
                </div>

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
                <div className="flex flex-col gap-8">
                    {Object.entries(options).map(([subCategory, labels]) => (
                        <div key={subCategory} className={"flex flex-col gap-2"}>
                            <p className="text-white font-medium">{subCategory}</p>
                            <div className="flex gap-2 flex-wrap mt-1">
                                {labels.map(label => {
                                    const selected = selectedPoi?.tags?.[selectedSubTab]?.[subCategory]?.includes(label);
                                    return (
                                        <button
                                            key={label}
                                            className={`px-4 py-2 rounded-full border text-sm ${
                                                selected ? "bg-white text-black border-white" : "text-white border-white"
                                            }`}
                                            onClick={() => updateTag(selectedPoiId, selectedSubTab, subCategory, label)}
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

            <div className={"flex"}>
                <PrimaryButton logo={"/logo/checkmark.svg"} onClick={() => setControlPanelState("AddPin")}>Save</PrimaryButton>
            </div>
        </div>
    );
};