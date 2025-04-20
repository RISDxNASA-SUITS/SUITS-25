type EvaTab = "PR" | "EVA1" | "EVA2";

type MainTabProps = {
    selected: EvaTab;
    onSelect: (eva: EvaTab) => void;
};

export default function MainTab({ selected, onSelect }: MainTabProps) {
    const tabs: EvaTab[] = ["PR", "EVA1", "EVA2"];

    const getRoundedClass = (index: number, length: number) => {
        if (index === 0) return "rounded-l-xl";
        if (index === length - 1) return "rounded-r-xl";
        return "";
    };

    return (
        <div className="flex border border-white rounded-xl">
            {tabs.map((tab, index) => {
                const isSelected = selected === tab;
                return (
                    <button
                        key={tab}
                        onClick={() => onSelect(tab)}
                        className={`
                            flex-1 py-2.5 text-white text-center transition-all
                            ${getRoundedClass(index, tabs.length)}
                            ${isSelected
                            ? "bg-white/10 border border-light-purple font-bold"
                            : "bg-transparent border border-white font-medium"}
                            hover:bg-white/10
                        `}
                    >
                        {tab}
                    </button>
                );
            })}
        </div>
    );
}
