


export default function ThreeBig({labels, values}: {labels: string[], values: string[]}) {
    return (<div className="basis-1/5 flex flex-row bg-opacity-10 bg-white rounded-lg items-center justify-center w-full gap-2">

    
        {[1,2,3].map((value, index) => (
            <div className="basis-1/3 flex w-full flex-col items-center justify-center rounded-large p-4">
                <div className="text-white-50 text-sm">{labels[index]}</div>
                <div className="text-2xl font-bold">{values[index]}</div>
            </div>
        ))}
        </div>
    )
}