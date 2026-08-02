import type { TaskAction, TaskState } from "./taskTypes";

export const initialTaskState: TaskState = {
  tasks: [],
  isHydrated: false,
};

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case "HYDRATE_TASKS":
      return {
        ...state,
        tasks: action.payload,
        isHydrated: true,
      };

    case "ADD_TASK":
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
      };

    case "ADD_TASKS":
      return {
        ...state,
        tasks: [...action.payload, ...state.tasks],
      };

    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? {
                ...task,
                completed: !task.completed,
              }
            : task,
        ),
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload.id),
      };

    default:
      return state;
  }
}
