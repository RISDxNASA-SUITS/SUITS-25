import { useState, useEffect } from "react";
import TaskCard from "@/app/components/ui/Cards/TaskCard"
import useTaskStore from "@/app/hooks/taskCounterHook";
interface TasksProps {
    taskName: string;
    subTask: string[];
    risk: string;
    duration: number;
}

interface TasksSectionProps {
    tasks: TasksProps[];
}

export const TasksSection = ({ tasks }: TasksSectionProps) => {
    
    if (!tasks || tasks.length === 0) {
        return (
            <div>No Tasks Available</div>
        );
    }
    const highRiskTasks = tasks.filter((task) => (task.risk === 'high risk'))
    const lowRiskTasks = tasks.filter((task) => (task.risk === 'low risk'))
    return (
        <div  className={"overflow-y-auto scrollbar-thin scrollbar-thumb-white-10 scrollbar-track-transparent"}>
            {highRiskTasks.length === 0 ? null  : <div className = {""}>
                <p className = "text-center text-3xl font-bold">High Risk/Priority</p>
                <hr />
                {highRiskTasks.map((task, index) => (
                    <div className = "m-3" key={task.taskName} >
                        <TaskCard taskName={task.taskName} subTask={task.subTask} risk={task.risk} duration={task.duration}/>
                        {index < highRiskTasks.length - 1 && (<hr/>)}
                    </div>
                ))}
            </div>}
            {lowRiskTasks.length === 0 ? null : <div className = {highRiskTasks.length === 0 ? "" : "my-10"}>
                <p className = "text-center text-3xl font-bold">Low Risk/Priority</p>
                <hr />
                {lowRiskTasks.map((task, index) => (
                    <div key={task.taskName} className = "m-3">
                        <TaskCard taskName={task.taskName} subTask={task.subTask} risk={task.risk} duration={task.duration}/>
                        {index < lowRiskTasks.length - 1 && (<hr/>)}
                    </div>
                ))}
            </div>}
        </div>
    )
}

export default TasksSection;