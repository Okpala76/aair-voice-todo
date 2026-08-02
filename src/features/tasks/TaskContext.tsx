import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

import { loadTasks, saveTasks } from "../../storage/taskStorage";
import { createTask } from "./taskFactory";
import { initialTaskState, taskReducer } from "./taskReducer";
import type { CreateTaskInput, Task, TaskState } from "./taskTypes";

type TaskContextValue = {
  state: TaskState;
  storageError: string | null;
  addTask: (input: CreateTaskInput) => Task;
  addTasks: (inputs: CreateTaskInput[]) => Task[];
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
};

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export function TaskProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState);

  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function hydrateTasks() {
      try {
        const storedTasks = await loadTasks();

        if (!isMounted) {
          return;
        }

        dispatch({
          type: "HYDRATE_TASKS",
          payload: storedTasks,
        });
      } catch (error: unknown) {
        console.error("Loading stored tasks failed:", error);

        if (!isMounted) {
          return;
        }

        setStorageError("Saved tasks could not be restored.");

        dispatch({
          type: "HYDRATE_TASKS",
          payload: [],
        });
      }
    }

    void hydrateTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!state.isHydrated) {
      return;
    }

    async function persistTasks() {
      try {
        await saveTasks(state.tasks);
        setStorageError(null);
      } catch (error: unknown) {
        console.error("Saving tasks failed:", error);

        setStorageError("Your latest task changes could not be saved.");
      }
    }

    void persistTasks();
  }, [state.isHydrated, state.tasks]);

  const value = useMemo<TaskContextValue>(
    () => ({
      state,
      storageError,

      addTask(input) {
        const task = createTask(input);

        dispatch({
          type: "ADD_TASK",
          payload: task,
        });

        return task;
      },

      addTasks(inputs) {
        const tasks = inputs.map(createTask);

        if (tasks.length === 0) {
          return [];
        }

        dispatch({
          type: "ADD_TASKS",
          payload: tasks,
        });

        return tasks;
      },

      toggleTask(id) {
        dispatch({
          type: "TOGGLE_TASK",
          payload: { id },
        });
      },

      deleteTask(id) {
        dispatch({
          type: "DELETE_TASK",
          payload: { id },
        });
      },
    }),
    [state, storageError],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks(): TaskContextValue {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error("useTasks must be used inside TaskProvider.");
  }

  return context;
}
