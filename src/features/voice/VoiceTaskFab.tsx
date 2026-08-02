import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { transcribeRecording } from "../../services/transcriptionApi";
import { colors } from "../../theme/colors";
import { useTasks } from "../tasks/TaskContext";
import { parseTranscriptIntoTasks } from "./taskTranscriptParser";

type VoiceStatus =
  | "idle"
  | "requesting-permission"
  | "listening"
  | "transcribing"
  | "processing"
  | "success"
  | "error";

type VoiceTaskFabProps = {
  bottom: number;
};

export function VoiceTaskFab({ bottom }: VoiceTaskFabProps) {
  const { addTasks } = useTasks();

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const recorderState = useAudioRecorderState(audioRecorder);

  const [status, setStatus] = useState<VoiceStatus>("idle");

  const [errorMessage, setErrorMessage] = useState("");

  const [lastTranscript, setLastTranscript] = useState("");

  const [createdTaskCount, setCreatedTaskCount] = useState(0);

  const durationSeconds = Math.round(recorderState.durationMillis / 1000);

  const isBusy =
    status === "requesting-permission" ||
    status === "transcribing" ||
    status === "processing";

  async function startRecording() {
    try {
      setStatus("requesting-permission");
      setErrorMessage("");
      setLastTranscript("");
      setCreatedTaskCount(0);

      const permission = await AudioModule.requestRecordingPermissionsAsync();

      if (!permission.granted) {
        throw new Error(
          "Microphone permission is required to create voice tasks.",
        );
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await audioRecorder.prepareToRecordAsync();

      audioRecorder.record();

      setStatus("listening");
    } catch (error: unknown) {
      console.error("Starting voice recording failed:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The recording could not be started.",
      );

      setStatus("error");
    }
  }

  async function stopAndCreateTasks() {
    try {
      await audioRecorder.stop();

      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });

      const recordingUri = audioRecorder.uri;

      if (!recordingUri) {
        throw new Error("The recording file could not be found.");
      }

      setStatus("transcribing");

      const transcript = await transcribeRecording(recordingUri);

      setLastTranscript(transcript);
      setStatus("processing");

      const taskInputs = parseTranscriptIntoTasks(transcript);

      if (taskInputs.length === 0) {
        throw new Error("No clear tasks were detected in the recording.");
      }

      const createdTasks = addTasks(taskInputs);

      setCreatedTaskCount(createdTasks.length);
      setStatus("success");
    } catch (error: unknown) {
      console.error("Creating voice tasks failed:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Your voice tasks could not be created.",
      );

      setStatus("error");
    }
  }

  async function cancelRecording() {
    try {
      if (recorderState.isRecording) {
        await audioRecorder.stop();
      }

      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });
    } catch (error: unknown) {
      console.error("Cancelling recording failed:", error);
    } finally {
      setStatus("idle");
    }
  }

  function handleFabPress() {
    if (status === "listening") {
      void stopAndCreateTasks();
      return;
    }

    if (!isBusy) {
      void startRecording();
    }
  }

  function getStatusTitle(): string {
    switch (status) {
      case "requesting-permission":
        return "Preparing microphone...";

      case "listening":
        return `Listening... ${durationSeconds}s`;

      case "transcribing":
        return "Transcribing your voice...";

      case "processing":
        return "Creating your tasks...";

      case "success":
        return `${createdTaskCount} ${
          createdTaskCount === 1 ? "task" : "tasks"
        } added`;

      case "error":
        return "Voice task failed";

      default:
        return "";
    }
  }

  function getStatusDescription(): string {
    switch (status) {
      case "requesting-permission":
        return "Checking microphone access.";

      case "listening":
        return "Say one or more tasks, then tap Stop.";

      case "transcribing":
        return "Converting your recording into text.";

      case "processing":
        return "Separating the transcript into tasks.";

      case "success":
        return lastTranscript
          ? `Heard: “${lastTranscript}”`
          : "Your tasks were added successfully.";

      case "error":
        return errorMessage;

      default:
        return "";
    }
  }

  return (
    <>
      {status !== "idle" ? (
        <View
          style={[
            styles.statusPanel,
            {
              bottom: bottom + 76,
            },
          ]}
        >
          <Text style={styles.statusTitle}>{getStatusTitle()}</Text>

          <Text style={styles.statusDescription}>{getStatusDescription()}</Text>

          {status === "listening" ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => void cancelRecording()}
              style={({ pressed }) => [
                styles.panelAction,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.cancelText}>Cancel recording</Text>
            </Pressable>
          ) : null}

          {status === "success" || status === "error" ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => setStatus("idle")}
              style={({ pressed }) => [
                styles.panelAction,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.dismissText}>Dismiss</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      <Pressable
        accessibilityLabel={
          status === "listening"
            ? "Stop voice recording"
            : "Create tasks using your voice"
        }
        accessibilityRole="button"
        disabled={isBusy}
        onPress={handleFabPress}
        style={({ pressed }) => [
          styles.fab,
          {
            bottom,
          },
          status === "listening" && styles.listeningFab,
          pressed && !isBusy && styles.pressedFab,
          isBusy && styles.disabledFab,
        ]}
      >
        {isBusy ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.fabIcon}>
            {status === "listening" ? "■" : "🎙️"}
          </Text>
        )}
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  statusPanel: {
    position: "absolute",
    right: 20,
    left: 20,
    zIndex: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.surface,
    padding: 16,
    elevation: 7,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.16,
    shadowRadius: 8,
  },
  statusTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "700",
  },
  statusDescription: {
    marginTop: 6,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  panelAction: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingVertical: 4,
  },
  cancelText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: "600",
  },
  dismissText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 20,
    zIndex: 11,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    backgroundColor: colors.primary,
    elevation: 8,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 7,
  },
  listeningFab: {
    backgroundColor: colors.danger,
  },
  pressedFab: {
    transform: [{ scale: 0.95 }],
  },
  disabledFab: {
    opacity: 0.75,
  },
  fabIcon: {
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 30,
  },
  pressed: {
    opacity: 0.6,
  },
});
