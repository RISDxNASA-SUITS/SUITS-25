

export function BottomHorizontal({values, labels}: {values: string[], labels: string[]}) {
    return (
        <div className="flex bg-white bg-opacity-10 rounded-lg items-center justify-center flex-row gap-4">
            {[1,2,3].map((val, index) => (
            <div className="flex flex-col basis-1/4 gap-4">
                <div className="text-white-50 text-sm">{labels[index]}</div>
                <div className="text-xl font-bold">{values[index]}</div>
            </div>
        ))}
        </div>
    )
    
}