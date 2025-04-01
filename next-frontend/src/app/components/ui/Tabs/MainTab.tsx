type MainTabProps = {
    selected: string;
    onSelect: (eva: "EVA1" | "EVA2") => void;
}

export default function MainTab({selected, onSelect}: MainTabProps) {
    const renderButton = (label: "EVA1" | "EVA2", isLeft: boolean) => {
        const isSelected = selected === label;

        return(
            <button
                className={`flex-1 py-2.5 items-center justify-center text-white transition-all
                ${isSelected ? "bg-white-10 border border-light-purple font-bold"
                    : "bg-transparent border border-white font-medium"}
                ${isLeft ? "rounded-l-xl" : "rounded-r-xl"}
                hover:bg-white-10`}
                onClick={() => onSelect(label)}
            >
                {label}
            </button>
        )
    }


    return (
        <div className={"flex"}>
            {renderButton("EVA1", true)}
            {renderButton("EVA2", false)}
        </div>
    )
}