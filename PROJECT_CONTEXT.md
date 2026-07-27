# Voice Todo — Project Context

## Project Goal

Build the AAIR Labs React Native Developer Exercise to completion.

The application must support manual task management, local persistence,
two-screen navigation, and voice-created tasks.

## Current Phase

Batch 0 — Project foundation

## MVP Scope

- Add tasks with a required title
- Optional task description
- Complete and reopen tasks
- Delete tasks
- Display all tasks
- Persist tasks with AsyncStorage
- Task List and Add Task screens
- Voice recording through a Floating Action Button
- Audio transcription through a secure backend
- Split natural-language speech into multiple tasks
- Required screenshots and README

## Technical Decisions

- Expo
- React Native
- TypeScript strict mode
- React Navigation native stack
- Context and useReducer for task state
- AsyncStorage repository abstraction
- expo-audio for recording
- Separate TypeScript backend for transcription
- OpenAI secrets must never be stored in the mobile application

## Completed

- [🫂] Expo project created
- [🫂 ] Required dependencies installed
- [🫂] Project directories created
- [🫂] Strict TypeScript enabled
- [🫂] Root navigator created
- [🫂] Task List placeholder created
- [🫂] Add Task placeholder created
- [🫂] Application runs on Android

## Current Files

- App.tsx
- src/navigation/navigationTypes.ts
- src/navigation/RootNavigator.tsx
- src/screens/TaskListScreen.tsx
- src/screens/AddTaskScreen.tsx
- src/theme/colors.ts

## Current Test Procedure

1. Run `npx expo start`.
2. Open the application on Android.
3. Confirm the Task List screen appears.
4. Select Add Task.
5. Confirm the Add Task screen appears.
6. Return to the Task List screen.

## Known Problems

None recorded.

## Next Batch

Batch 1 — Voice feasibility spike.
