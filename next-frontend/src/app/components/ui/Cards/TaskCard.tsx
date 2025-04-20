import { useState } from "react";

interface TaskCardProps {
    taskName: string;
    subTask: string[];
    risk: string;
    duration: number;
}

export const TaskCard = ({ taskName, subTask, risk, duration }: TaskCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [checkedSubTasks, setCheckedSubTasks] = useState<boolean[]>(
        Array(subTask.length).fill(false)
    );

    const handleExpand = () => {
        setIsExpanded(prev => !prev);
    };

    const handleCheck = (index: number) => {
        setCheckedSubTasks(prev => {
            const updated = [...prev];
            updated[index] = !updated[index];
            return updated;
        });
    };

    return (
        <div className="flex flex-col rounded-xl mb-4 border-white/10">
            {/* Header */}
            <div className="flex items-center p-3 justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <p className="text-2xl font-bold">{taskName}</p>
                </div>
                <button onClick={handleExpand}>
                    <img
                        src={isExpanded ? "/logo/minimize.svg" : "/logo/expand.svg"}
                        alt="expand"
                        className={`h-5 w-5 min-w-[20px] min-h-[20px] transition-transform duration-300`}
                    />
                </button>
            </div>

            {/* Meta Info */}
            <div className="flex p-3 pt-0 gap-2">
                <div className="inline-flex px-3 py-1 justify-center items-center bg-white/10 rounded-3xl">
                    {risk}
                </div>
                <div className="inline-flex px-3 py-1 justify-center items-center gap-1 bg-white/10 rounded-3xl">
                    <img src={"/logo/timer.svg"} alt="timer" className="h-5 w-5" />
                    {duration}m
                </div>
            </div>

            {/* Animated Expandable Section */}
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden px-4
                    ${isExpanded ? "max-h-[500px] opacity-100 py-4" : "max-h-0 opacity-0 py-0"}`}
            >
                <div className="flex flex-col gap-2">
                    {subTask.map((task, index) => (
                        <label key={index} className="flex items-start gap-2 text-base">
                            <div className="relative w-6 h-6">
                                <input
                                    type="checkbox"
                                    checked={checkedSubTasks[index]}
                                    onChange={() => handleCheck(index)}
                                    className={`appearance-none w-6 h-6 rounded-md border-2 
                                        border-white checked:border-white/50 peer`}
                                />
                                <svg
                                    className={`w-4 h-4 text-white/50 absolute top-1 left-1 
                                        pointer-events-none
                                        ${checkedSubTasks[index] ? "block" : "hidden"}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className={checkedSubTasks[index] ? "text-white/50" : "text-white"}>
                                {task}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
