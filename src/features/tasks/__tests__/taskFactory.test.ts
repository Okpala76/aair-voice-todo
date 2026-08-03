import { createTask } from "../taskFactory";

describe("createTask", () => {
  it("creates a valid incomplete task", () => {
    const task = createTask({
      title: "Buy provisions",
    });

    expect(task).toMatchObject({
      title: "Buy provisions",
      completed: false,
    });

    expect(task.id).toEqual(expect.any(String));
    expect(task.id.length).toBeGreaterThan(0);

    expect(task.createdAt).toEqual(expect.any(String));

    expect(Number.isNaN(Date.parse(task.createdAt))).toBe(false);
  });

  it("trims the title and description", () => {
    const task = createTask({
      title: "   Call mom   ",
      description: "   Ask about Sunday   ",
    });

    expect(task.title).toBe("Call mom");

    expect(task.description).toBe("Ask about Sunday");
  });

  it("does not store an empty description", () => {
    const task = createTask({
      title: "Review application",
      description: "     ",
    });

    expect(task).not.toHaveProperty("description");
  });

  it("rejects an empty task title", () => {
    expect(() =>
      createTask({
        title: "     ",
      }),
    ).toThrow("A task title is required.");
  });
});
