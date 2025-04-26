import React, {useState, useRef} from 'react'

interface TooltipProps {
    text:string
}

export const Tooltip = ({text} : TooltipProps) => {
    const [showTooltip, setShowTooltip] = useState(false)
    const timeoutId = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        timeoutId.current = setTimeout(()=> {
            setShowTooltip(true)
        }, 1000)
    };

    const handleMouseLeave = () => {
        if (timeoutId.current){
            clearTimeout(timeoutId.current);
        }

        setShowTooltip(false);
    };

    return (
    <div className="absolute top-0 left-0 w-full h-full" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {showTooltip &&
                <div className="absolute -top-10 inset-x-0 flex items-center justify-center">
                    <div className="z-10 rounded-lg py-2 p-4 bg-[#100A28] text-sm text-nowrap font-light">
                    {text}
                        <img className="h-5 w-full absolute -bottom-4 inset-x-0 -z-1" src="/misc/tooltip_carret.svg"/>
                    </div>
                </div>
        }
    </div>
    )
}
