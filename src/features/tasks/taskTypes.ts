export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
};

export type CreateTaskInput = {
  title: string;
  description?: string;
};

export type TaskState = {
  tasks: Task[];
  isHydrated: boolean;
};

export type TaskAction =
  | {
      type: "HYDRATE_TASKS";
      payload: Task[];
    }
  | {
      type: "ADD_TASK";
      payload: Task;
    }
  | {
      type: "ADD_TASKS";
      payload: Task[];
    }
  | {
      type: "TOGGLE_TASK";
      payload: {
        id: string;
      };
    }
  | {
      type: "DELETE_TASK";
      payload: {
        id: string;
      };
    };
