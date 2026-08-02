import type { CreateTaskInput, Task } from "./taskTypes";

function createTaskId(): string {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).slice(2, 10);

  return `${timestamp}-${randomPart}`;
}

export function createTask(input: CreateTaskInput): Task {
  const title = input.title.trim();
  const description = input.description?.trim();

  if (!title) {
    throw new Error("A task title is required.");
  }

  const baseTask: Task = {
    id: createTaskId(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  if (description) {
    return {
      ...baseTask,
      description,
    };
  }

  return baseTask;
}
