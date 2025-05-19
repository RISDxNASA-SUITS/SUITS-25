
"use client";

import { useState } from "react";

import { useEffect } from "react";

interface TaskCardProps {
    warningName: string;
    description: string;
}

export const WarningCard = ({warningName, description}: TaskCardProps ) => {
        return (
            <div className={"flex items-center p-3 justify-between bg-warning border-l-2 border-crimson-red"}>
            <div className={"flex flex-col gap-2"}>
                <p className={"text-2xl font-bold"}>{"Battery Failure"}</p>
                <div className={"flex flex-row items-center gap-2"}>
                    <img src={"/logo/Hazard.svg"} alt="poi" className="h-5 w-5" />
                    <p className={"text-lg"}>{"Abort now: Point of No Return"}</p>
                </div>
            </div>
        </div>
        );
    }
// };

export default WarningCard;