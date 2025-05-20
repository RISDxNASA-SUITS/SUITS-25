"use client";
import React, { useRef, useState } from "react";

type AudioPlayerProps = {
    audioURL: string;
}

const CustomAudioPlayer = ({ audioURL} : AudioPlayerProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="flex">
            <button
                onClick={togglePlay}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
            >
                {isPlaying ? "pause" : "play"}
            </button>

            <audio ref={audioRef} src={audioURL} className="hidden" />
        </div>
    );
};

export default CustomAudioPlayer;
