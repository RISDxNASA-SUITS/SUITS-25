import TaskCard from "@/app/components/ui/Cards/TaskCard"

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

    return (
        <div  className={"overflow-y-auto scrollbar-thin scrollbar-thumb-white-10 scrollbar-track-transparent"}>
            {tasks.map((task, index) => (
                <div key={task.taskName} >
                    <TaskCard taskName={task.taskName} subTask={task.subTask} risk={task.risk} duration={task.duration}/>
                    {index < tasks.length - 1 && (<hr/>)}
                </div>
            ))}
        </div>
    )
}

export default TasksSection;