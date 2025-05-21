import { create } from "zustand";


interface TaskState {
    tasksComplete: number,
    tasksTotal : number
    getTasksComplete : () => void;
    getTasksTotal : () => void;
    setTaskComplete: (x: number) => void;
    setTasksTotal: (x: number) => void;
    newTaskComplete: () => void;
}

const useTaskStore = create<TaskState>((set, get) => ({
    tasksComplete : 0,
    tasksTotal : 0,
    getTasksComplete : () => get().tasksComplete,
    getTasksTotal : () => get().tasksTotal,
    setTaskComplete : (x : number) => set((state) => ({...state, tasksComplete : x})),
    setTasksTotal : (x : number) => set((state) => ({...state, tasksTotal : x})),
    newTaskComplete : () => set((state) => ({...state, tasksComplete : state.tasksComplete + 1}))

}))

export default useTaskStore
