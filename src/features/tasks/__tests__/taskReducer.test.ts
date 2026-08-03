import { initialTaskState, taskReducer } from "../taskReducer";
import type { Task, TaskState } from "../taskTypes";

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    title: "Default task",
    completed: false,
    createdAt: "2026-08-03T12:00:00.000Z",
    ...overrides,
  };
}

describe("taskReducer", () => {
  it("hydrates tasks and marks state as hydrated", () => {
    const storedTask = makeTask();

    const nextState = taskReducer(initialTaskState, {
      type: "HYDRATE_TASKS",
      payload: [storedTask],
    });

    expect(nextState.isHydrated).toBe(true);

    expect(nextState.tasks).toEqual([storedTask]);
  });

  it("adds a new task to the beginning", () => {
    const existingTask = makeTask({
      id: "existing",
      title: "Existing task",
    });

    const newTask = makeTask({
      id: "new",
      title: "New task",
    });

    const state: TaskState = {
      tasks: [existingTask],
      isHydrated: true,
    };

    const nextState = taskReducer(state, {
      type: "ADD_TASK",
      payload: newTask,
    });

    expect(nextState.tasks).toEqual([newTask, existingTask]);
  });

  it("adds multiple voice tasks together", () => {
    const existingTask = makeTask({
      id: "existing",
      title: "Existing task",
    });

    const buyTask = makeTask({
      id: "buy",
      title: "Buy provisions",
    });

    const callTask = makeTask({
      id: "call",
      title: "Call mom",
    });

    const state: TaskState = {
      tasks: [existingTask],
      isHydrated: true,
    };

    const nextState = taskReducer(state, {
      type: "ADD_TASKS",
      payload: [buyTask, callTask],
    });

    expect(nextState.tasks).toEqual([buyTask, callTask, existingTask]);
  });

  it("toggles a task without modifying the old state", () => {
    const originalTask = makeTask({
      completed: false,
    });

    const state: TaskState = {
      tasks: [originalTask],
      isHydrated: true,
    };

    const nextState = taskReducer(state, {
      type: "TOGGLE_TASK",
      payload: {
        id: originalTask.id,
      },
    });

    expect(nextState.tasks[0]?.completed).toBe(true);

    expect(state.tasks[0]?.completed).toBe(false);

    expect(nextState).not.toBe(state);
    expect(nextState.tasks).not.toBe(state.tasks);
  });

  it("marks a completed task as incomplete", () => {
    const completedTask = makeTask({
      completed: true,
    });

    const state: TaskState = {
      tasks: [completedTask],
      isHydrated: true,
    };

    const nextState = taskReducer(state, {
      type: "TOGGLE_TASK",
      payload: {
        id: completedTask.id,
      },
    });

    expect(nextState.tasks[0]?.completed).toBe(false);
  });

  it("deletes only the selected task", () => {
    const firstTask = makeTask({
      id: "first",
      title: "First task",
    });

    const secondTask = makeTask({
      id: "second",
      title: "Second task",
    });

    const state: TaskState = {
      tasks: [firstTask, secondTask],
      isHydrated: true,
    };

    const nextState = taskReducer(state, {
      type: "DELETE_TASK",
      payload: {
        id: firstTask.id,
      },
    });

    expect(nextState.tasks).toEqual([secondTask]);
  });
});
