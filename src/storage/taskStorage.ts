import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Task } from "../features/tasks/taskTypes";

const TASK_STORAGE_KEY = "@voice-todo/tasks:v1";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTask(value: unknown): value is Task {
  if (!isObject(value)) {
    return false;
  }

  const hasValidDescription =
    value.description === undefined || typeof value.description === "string";

  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.completed === "boolean" &&
    typeof value.createdAt === "string" &&
    hasValidDescription
  );
}

export async function loadTasks(): Promise<Task[]> {
  const storedValue = await AsyncStorage.getItem(TASK_STORAGE_KEY);

  if (storedValue === null) {
    return [];
  }

  const parsedValue: unknown = JSON.parse(storedValue);

  if (!Array.isArray(parsedValue)) {
    throw new Error("Stored task data is not a valid array.");
  }

  if (!parsedValue.every(isTask)) {
    throw new Error("One or more stored tasks are invalid.");
  }

  return parsedValue;
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
}
