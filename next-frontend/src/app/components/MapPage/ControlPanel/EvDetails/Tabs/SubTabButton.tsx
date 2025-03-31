type SubTabButtonProps = {
    selected: string
    isSelected: boolean
    onSelect: (selected: string) => void
}

export default function SubTabButton({selected, isSelected, onSelect}: SubTabButtonProps) {


    return (
            <button
                className={'flex-1 py-2.5 items-center justify-center text-white transition-all rounded-xl ' +
                    `${isSelected ? "bg-white-10" : "bg-transparent"}
                     ${isSelected ? "border border-light-purple font-bold" : "border border-white font-medium"}
                     hover:bg-white-10`}
                onClick={() => onSelect(selected)}
            >
                {selected}
            </button>
    )
}