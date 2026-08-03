import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Task } from "../../features/tasks/taskTypes";
import { loadTasks, saveTasks } from "../taskStorage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

const mockedGetItem = jest.mocked(AsyncStorage.getItem);

const mockedSetItem = jest.mocked(AsyncStorage.setItem);

const storageKey = "@voice-todo/tasks:v1";

const validTask: Task = {
  id: "task-1",
  title: "Buy provisions",
  description: "Milk and bread",
  completed: false,
  createdAt: "2026-08-03T12:00:00.000Z",
};

describe("taskStorage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("saveTasks", () => {
    it("serializes tasks before storing them", async () => {
      await saveTasks([validTask]);

      expect(mockedSetItem).toHaveBeenCalledWith(
        storageKey,
        JSON.stringify([validTask]),
      );
    });
  });

  describe("loadTasks", () => {
    it("returns an empty array when nothing is stored", async () => {
      mockedGetItem.mockResolvedValue(null);

      await expect(loadTasks()).resolves.toEqual([]);
    });

    it("loads and parses valid stored tasks", async () => {
      mockedGetItem.mockResolvedValue(JSON.stringify([validTask]));

      await expect(loadTasks()).resolves.toEqual([validTask]);

      expect(mockedGetItem).toHaveBeenCalledWith(storageKey);
    });

    it("rejects malformed JSON", async () => {
      mockedGetItem.mockResolvedValue("{this is not valid JSON");

      await expect(loadTasks()).rejects.toBeInstanceOf(SyntaxError);
    });

    it("rejects stored data that is not an array", async () => {
      mockedGetItem.mockResolvedValue(
        JSON.stringify({
          task: validTask,
        }),
      );

      await expect(loadTasks()).rejects.toThrow(
        "Stored task data is not a valid array.",
      );
    });

    it("rejects invalid tasks inside the array", async () => {
      mockedGetItem.mockResolvedValue(
        JSON.stringify([
          {
            title: "Missing required fields",
          },
        ]),
      );

      await expect(loadTasks()).rejects.toThrow(
        "One or more stored tasks are invalid.",
      );
    });

    it("allows tasks without a description", async () => {
      const taskWithoutDescription: Task = {
        id: "task-2",
        title: "Call mom",
        completed: true,
        createdAt: "2026-08-03T13:00:00.000Z",
      };

      mockedGetItem.mockResolvedValue(JSON.stringify([taskWithoutDescription]));

      await expect(loadTasks()).resolves.toEqual([taskWithoutDescription]);
    });
  });
});
