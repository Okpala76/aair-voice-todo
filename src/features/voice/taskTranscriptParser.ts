import type { CreateTaskInput } from "../tasks/taskTypes";

const MAX_VOICE_TASKS = 10;

const TASK_STARTERS = [
  "add",
  "book",
  "buy",
  "call",
  "cancel",
  "check",
  "clean",
  "collect",
  "complete",
  "contact",
  "cook",
  "create",
  "email",
  "finish",
  "fix",
  "get",
  "go",
  "make",
  "message",
  "order",
  "organize",
  "pay",
  "pick",
  "prepare",
  "read",
  "remind",
  "reply",
  "review",
  "schedule",
  "send",
  "shop",
  "submit",
  "take",
  "update",
  "visit",
  "wash",
  "write",
];

const TASK_STARTER_PATTERN = TASK_STARTERS.join("|");

const CONNECTOR_PATTERN = new RegExp(
  [
    `(?:,\\s*|\\s+)(?:and then|then|also|next|after that)\\s+`,
    `,\\s*(?=(?:${TASK_STARTER_PATTERN})\\b)`,
    `\\s+and\\s+(?=(?:${TASK_STARTER_PATTERN})\\b)`,
  ].join("|"),
  "i",
);

function cleanTaskTitle(value: string): string {
  const cleanedValue = value
    .trim()
    .replace(
      /^(?:(?:first|second|third|fourth|finally)[,:]?\s+|\d+[\s.)-]+|please\s+|i need to\s+|i want to\s+|remind me to\s+|don't forget to\s+)/i,
      "",
    )
    .trim();

  if (!cleanedValue) {
    return "";
  }

  return (
    cleanedValue.charAt(0).toUpperCase() +
    cleanedValue.slice(1)
  );
}

export function parseTranscriptIntoTasks(
  transcript: string,
): CreateTaskInput[] {
  const normalizedTranscript = transcript
    .replace(/\s+/g, " ")
    .trim();

  if (!normalizedTranscript) {
    return [];
  }

  const taskTitles = normalizedTranscript
    .split(/[.!?;\n]+/)
    .flatMap((sentence) =>
      sentence.split(CONNECTOR_PATTERN),
    )
    .map(cleanTaskTitle)
    .filter(Boolean);

  const uniqueTitles = Array.from(
    new Map(
      taskTitles.map((title) => [
        title.toLowerCase(),
        title,
      ]),
    ).values(),
  );

  return uniqueTitles
    .slice(0, MAX_VOICE_TASKS)
    .map((title) => ({ title }));
}