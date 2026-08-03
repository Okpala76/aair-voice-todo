import { parseTranscriptIntoTasks } from "../taskTranscriptParser";

describe("parseTranscriptIntoTasks", () => {
  it("returns no tasks for an empty transcript", () => {
    expect(parseTranscriptIntoTasks("    ")).toEqual([]);
  });

  it("creates one task from one instruction", () => {
    expect(parseTranscriptIntoTasks("Buy provisions.")).toEqual([
      {
        title: "Buy provisions",
      },
    ]);
  });

  it("splits two clear tasks joined by and", () => {
    expect(parseTranscriptIntoTasks("Buy provisions and call mom.")).toEqual([
      {
        title: "Buy provisions",
      },
      {
        title: "Call mom",
      },
    ]);
  });

  it("does not incorrectly split one shopping task", () => {
    expect(parseTranscriptIntoTasks("Buy bread and milk.")).toEqual([
      {
        title: "Buy bread and milk",
      },
    ]);
  });

  it("splits comma and sequence connectors", () => {
    expect(
      parseTranscriptIntoTasks("Wash clothes, clean the room, then email Ada."),
    ).toEqual([
      {
        title: "Wash clothes",
      },
      {
        title: "Clean the room",
      },
      {
        title: "Email Ada",
      },
    ]);
  });

  it("removes common speech prefixes", () => {
    expect(parseTranscriptIntoTasks("Please call mom.")).toEqual([
      {
        title: "Call mom",
      },
    ]);

    expect(
      parseTranscriptIntoTasks("Remind me to submit the application."),
    ).toEqual([
      {
        title: "Submit the application",
      },
    ]);
  });

  it("removes duplicate tasks", () => {
    expect(parseTranscriptIntoTasks("Call mom. Call mom.")).toEqual([
      {
        title: "Call mom",
      },
    ]);
  });

  it("limits one recording to ten tasks", () => {
    const transcript = Array.from(
      {
        length: 12,
      },
      (_, index) => `Call person ${index + 1}.`,
    ).join(" ");

    const tasks = parseTranscriptIntoTasks(transcript);

    expect(tasks).toHaveLength(10);
  });
});
