# Voice Todo

A React Native to-do application that lets users create and manage tasks manually or through voice input.

Users can record a natural-language instruction such as:

> Buy provisions and call mom

The application transcribes the recording and creates separate tasks:

- Buy provisions
- Call mom

The project was built for the AAIR Labs React Native Developer Exercise.

---

## Features

### Task management

- Add a task with a required title
- Add an optional description
- Mark tasks as completed
- Mark completed tasks as incomplete
- Delete tasks with confirmation
- View active and completed task counts
- Display completed tasks with a clear visual distinction

### Local persistence

- Tasks are stored locally with AsyncStorage
- Tasks remain after the application is closed and reopened
- Completion states are also persisted
- Invalid stored data is handled safely

### Voice-created tasks

- Record audio using a microphone Floating Action Button
- Display clear listening and processing states
- Upload recordings to a secure backend
- Transcribe speech using Deepgram
- Split natural-language speech into one or more tasks
- Add all recognised tasks automatically
- Handle microphone, network, transcription and empty-speech errors

### User experience

- Empty task-list state
- Loading state while restoring saved tasks
- Form validation
- Character limits
- Keyboard-safe Add Task screen
- Accessible buttons and completion controls
- Responsive task list built with `FlatList`

---

## Screenshots

### Empty task list

![Empty task list](./screenshots/01-empty-task-list.jpg)

### Active and completed tasks

![Task list with mixed states](./screenshots/02-task-list-mixed-states.jpg)

### Add Task screen

![Add Task screen](./screenshots/03-add-task-screen.jpg)

### Voice listening mode

![Voice listening mode](./screenshots/04-voice-listening.jpg)

### Tasks created through voice input

![Voice-created tasks](./screenshots/05-voice-created-tasks.jpg)

---

## Technology stack

### Mobile application

- React Native
- Expo
- TypeScript
- React Navigation
- AsyncStorage
- Expo Audio
- Expo FileSystem

### Backend

- Node.js
- Express
- TypeScript
- Multer
- Deepgram Speech-to-Text API

---

## Architecture

The project separates task management, persistence, navigation, voice processing and backend communication.

```text
Voice Todo
│
├── Mobile application
│   ├── Screens
│   ├── Navigation
│   ├── Task Context
│   ├── Task reducer
│   ├── AsyncStorage repository
│   ├── Audio recorder
│   ├── Transcript parser
│   └── Transcription API service
│
└── Backend
    ├── Audio upload endpoint
    ├── Deepgram integration
    └── Environment-protected API key
```

Both manually entered and voice-created tasks pass through the same task state system.

```text
Manual task form ───────────┐
                            │
Voice transcript parser ────┼──> Task Context
                            │         ↓
                            │    Task reducer
                            │         ↓
                            └──> AsyncStorage
```

---

## Project structure

```text
aair-voice-todo/
├── assets/
├── screenshots/
│   ├── 01-empty-task-list.jpg
│   ├── 02-task-list-mixed-states.jpg
│   ├── 03-add-task-screen.jpg
│   ├── 04-voice-listening.jpg
│   └── 05-voice-created-tasks.jpg
├── server/
│   ├── src/
│   │   └── index.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── src/
│   ├── components/
│   │   └── TaskCard.tsx
│   ├── features/
│   │   ├── tasks/
│   │   │   ├── TaskContext.tsx
│   │   │   ├── taskFactory.ts
│   │   │   ├── taskReducer.ts
│   │   │   └── taskTypes.ts
│   │   └── voice/
│   │       ├── taskTranscriptParser.ts
│   │       └── VoiceTaskFab.tsx
│   ├── navigation/
│   │   ├── navigationTypes.ts
│   │   └── RootNavigator.tsx
│   ├── screens/
│   │   ├── AddTaskScreen.tsx
│   │   └── TaskListScreen.tsx
│   ├── services/
│   │   └── transcriptionApi.ts
│   ├── storage/
│   │   └── taskStorage.ts
│   └── theme/
│       └── colors.ts
├── .env.example
├── App.tsx
├── PROJECT_CONTEXT.md
├── app.json
├── package.json
└── tsconfig.json
```

---

## Prerequisites

Install the following before running the project:

- Node.js LTS
- npm
- Git
- Expo Go on an Android device, or an Android emulator
- A Deepgram API key

The mobile device and development computer should be connected to the same local network when running the backend locally.

---

## Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
cd aair-voice-todo
```

Install the mobile dependencies:

```bash
npm install
```

Install the backend dependencies:

```bash
cd server
npm install
cd ..
```

---

## Environment variables

### Mobile environment

Create `.env.local` in the project root:

```dotenv
EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_IPV4_ADDRESS:3000
```

Example:

```dotenv
EXPO_PUBLIC_API_URL=http://192.168.1.15:3000
```

Do not use `localhost` when testing from a physical phone. On the phone, `localhost` refers to the phone itself rather than the development computer.

The value should match the IPv4 address of the computer running the backend.

On Windows, find the address with:

```powershell
ipconfig
```

Look for the IPv4 address under the active Wi-Fi adapter.

### Backend environment

Create `server/.env`:

```dotenv
DEEPGRAM_API_KEY=your_real_deepgram_api_key
PORT=3000
```

The Deepgram key must never be stored in the mobile application.

The following safe templates are committed to the repository:

```text
.env.example
server/.env.example
```

The real environment files are ignored by Git.

---

## Running the backend

Open a terminal:

```bash
cd server
npm run dev
```

Expected output:

```text
Voice Todo server running on port 3000 using Deepgram
```

Test the server from the development computer:

```text
http://localhost:3000/health
```

Test it from the phone using the computer’s IPv4 address:

```text
http://YOUR_COMPUTER_IPV4_ADDRESS:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "provider": "Deepgram",
  "message": "Voice Todo server is running"
}
```

---

## Running the mobile application

Open another terminal from the project root:

```bash
npx expo start --clear
```

Then:

1. Open Expo Go on the Android device.
2. Scan the QR code.
3. Allow microphone access when prompted.
4. Confirm that the backend is still running.

The `--clear` option ensures that Expo reloads values from `.env.local`.

---

## Using the application

### Add a task manually

1. Press the `+` Floating Action Button.
2. Enter a task title.
3. Optionally enter a description.
4. Press **Save task**.

The title is required. Empty or whitespace-only titles cannot be saved.

### Complete a task

Press the checkbox beside the task.

The task title becomes crossed out and the completed count increases.

Press the checkbox again to mark it as incomplete.

### Delete a task

Press **Delete** on the task card and confirm the deletion.

### Create tasks using voice

1. Press the microphone Floating Action Button.
2. Speak one or more tasks.
3. Press the red Stop button.
4. Wait while the recording is transcribed and processed.
5. The recognised tasks are added automatically.

Example:

```text
Wash clothes, clean the room, then email Ada
```

Produces:

```text
Wash clothes
Clean the room
Email Ada
```

The parser avoids splitting phrases that likely belong to one task.

Example:

```text
Buy bread and milk
```

Produces one task:

```text
Buy bread and milk
```

---

## Voice-processing flow

```text
User speaks
    ↓
Expo Audio records an M4A file
    ↓
Mobile application uploads the recording
    ↓
Express backend receives the file
    ↓
Deepgram transcribes the audio
    ↓
Backend returns the transcript
    ↓
Transcript parser separates individual tasks
    ↓
Tasks are added through Task Context
    ↓
AsyncStorage persists the tasks
```

The Deepgram API key remains exclusively on the backend.

---

## Error handling

The application handles:

- Empty task titles
- Whitespace-only task titles
- Missing microphone permission
- Cancelled recordings
- Missing recording files
- Backend connection failures
- Transcription failures
- Recordings with no detectable speech
- Transcripts containing no clear tasks
- AsyncStorage read or write failures
- Invalid locally stored task data
- Repeated Save button presses

---

## Available commands

### Mobile application

Run the Expo development server:

```bash
npx expo start
```

Run TypeScript checks:

```bash
npx tsc --noEmit
```

Run ESLint:

```bash
npx expo lint
```

### Backend

Start the development server:

```bash
cd server
npm run dev
```

Run backend TypeScript checks:

```bash
npm run typecheck
```

Build the backend:

```bash
npm run build
```

Start the compiled backend:

```bash
npm start
```

---

## Security

- The Deepgram API key is stored only in `server/.env`.
- The backend API key is not included in the React Native bundle.
- Real environment files are excluded through `.gitignore`.
- Only safe environment templates are committed.
- Audio uploads are limited to 10 MB.
- Uploaded audio is processed in memory and is not permanently stored by the application backend.

---

## Current limitations

- The backend must be running for voice transcription to work.
- Local development requires the phone and computer to be reachable over the same network.
- The transcript parser uses deterministic natural-language rules rather than a large language model.
- Tasks currently have no due dates, search, filters or theme selector.

---

## Possible future improvements

- Unit tests for reducers, storage and transcript parsing
- Task search and status filters
- Due dates and due-date sorting
- Dark mode
- Task editing
- Task animations
- Cloud account synchronization
- Production backend deployment
- More advanced natural-language task extraction

---

## Evaluation coverage

| Requirement             | Implementation                               |
| ----------------------- | -------------------------------------------- |
| Add tasks               | Add Task screen                              |
| Required title          | Form validation and task factory             |
| Optional description    | Description input and task card              |
| Complete/incomplete     | Reversible checkbox control                  |
| Delete tasks            | Delete confirmation                          |
| View all tasks          | Task List screen using `FlatList`            |
| Visual distinction      | Strikethrough and reduced emphasis           |
| Persistence             | AsyncStorage                                 |
| Two-screen navigation   | React Navigation native stack                |
| Empty state             | Dedicated no-task interface                  |
| Voice FAB               | `VoiceTaskFab`                               |
| Speech transcription    | Deepgram backend integration                 |
| Multiple dictated tasks | Transcript parser and `addTasks()`           |
| Screenshots             | `/screenshots` folder and README             |
| TypeScript              | Strict TypeScript throughout                 |
| Unit tests              | Jest tests for task, storage and voice logic |

---

## Testing

The project contains unit tests for the core task and voice-processing logic.

Covered areas include:

- Task creation and input normalization
- Empty-title validation
- Adding one or multiple tasks
- Completing and reopening tasks
- Task deletion
- Transcript splitting
- Duplicate voice-task removal
- Voice-task limits
- AsyncStorage serialization
- Invalid stored-data handling

Run all tests:

```bash
npm test


## Author

Built as part of the AAIR Labs React Native Developer Exercise.
```
