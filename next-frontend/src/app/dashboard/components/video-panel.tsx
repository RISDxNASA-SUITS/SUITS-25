import { useState } from "react";

export default function VideoPanel({video, name, headlights=false}: {video: string, name: string, headlights?: boolean}) {
    const [headlightsOn, setHeadlightsOn] = useState(headlights);   
    return (
        <div className="basis-2/5 flex flex-col gap-4 h-full p-4">
            <div className="text-bold text-2xl">{name}</div>
            
            <div className="relative">
                <video className="bg-white rounded-large h-full w-full" src={video} autoPlay muted loop />
                {/* {headlights && (
                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-white text-2xl">Headlights On</div>
                    </div>
                )} */}
                {headlights && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] p-4 flex justify-between bg-midnight-purple rounded-lg">
                        <div className="justify-self-start">
                            {`PR Headlights | ${headlightsOn ? "On" : "Off"}`}
                        </div>
                        <div 
                            className={`w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer flex items-center p-1 ${headlightsOn ? 'bg-green-500' : 'bg-white'}`}
                            onClick={() => setHeadlightsOn(!headlightsOn)}
                        >
                            <div className={`w-4 h-4 rounded-full bg-gray-800 transition-transform duration-300 ${headlightsOn ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}