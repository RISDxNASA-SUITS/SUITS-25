interface TaskCardProps {
    taskName: string;
    station: string;
}

export const TaskCard = ({taskName, station}: TaskCardProps ) => {

    return (
        <div className={"flex items-center p-3 justify-between"}>
            <div className={"flex flex-col gap-2"}>
                <p className={"text-2xl font-bold"}>{taskName}</p>
                <div className={"flex flex-row items-center gap-2"}>
                    <img src={"/logo/poi.svg"} alt="poi" className="h-5 w-5" />
                    <p className={"text-lg"}>{station}</p>
                </div>
            </div>
            <div>
                <button>
                    <img src={"/logo/expand.svg"} alt="poi" className="h-5 w-5" />
                </button>
            </div>
        </div>
    )
}

export default TaskCard;