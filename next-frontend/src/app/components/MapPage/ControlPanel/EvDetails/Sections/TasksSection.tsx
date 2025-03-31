import TaskCard from "../Cards/TaskCard"

interface TasksProps {
    taskName: string;
    station: string;
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
                    <TaskCard taskName={task.taskName} station={task.station}/>
                    {index < tasks.length - 1 && (<hr/>)}
                </div>
            ))}
        </div>
    )
}

export default TasksSection;