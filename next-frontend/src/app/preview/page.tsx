"use client"

import PrimaryButton from "../components/MapPage/SubComponents/PrimaryButton";
import SecondaryButton from "../components/MapPage/SubComponents/SecondaryButton";
import TertiaryButton from "../components/MapPage/SubComponents/TertiaryButton";

export default function Preview() {

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-slate-800">
            <div className="flex flex-col gap-4">
                <p>
                    Primary Button
                </p>
                <PrimaryButton>
                    Button
                </PrimaryButton>
                <p>
                    Secondary Button
                </p>
                <SecondaryButton>
                    Button
                </SecondaryButton>
                <p>
                    Tertiary Button
                </p>
                <TertiaryButton>
                    Button
                </TertiaryButton>
            </div>
        </div>
    )
};


