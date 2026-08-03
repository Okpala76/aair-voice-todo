module.exports = {
  preset: "jest-expo",

  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],

  collectCoverageFrom: [
    "src/features/tasks/taskFactory.ts",
    "src/features/tasks/taskReducer.ts",
    "src/features/voice/taskTranscriptParser.ts",
    "src/storage/taskStorage.ts",
  ],

  coverageDirectory: "coverage",

  clearMocks: true,
};
