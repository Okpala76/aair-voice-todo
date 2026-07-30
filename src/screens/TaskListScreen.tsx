import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { transcribeRecording } from "../services/transcriptionApi";

import type { RootStackParamList } from "../navigation/navigationTypes";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "TaskList">;

export function TaskListScreen({ navigation }: Props) {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const recorderState = useAudioRecorderState(audioRecorder);

  const [recordingUri, setRecordingUri] = useState<string | null>(null);

  const [transcription, setTranscription] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    async function configureAudio() {
      const permission = await AudioModule.requestRecordingPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Microphone permission required",
          "Allow microphone access so the app can create tasks from your voice.",
        );

        return;
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
    }

    configureAudio().catch((error: unknown) => {
      console.error("Audio configuration failed:", error);

      Alert.alert(
        "Audio error",
        "The application could not configure audio recording.",
      );
    });
  }, []);

  async function startRecording() {
    try {
      setRecordingUri(null);
      setTranscription("");

      await audioRecorder.prepareToRecordAsync();

      audioRecorder.record();
    } catch (error: unknown) {
      console.error("Starting recording failed:", error);

      Alert.alert(
        "Recording failed",
        "The application could not start recording.",
      );
    }
  }

  async function stopRecording() {
    try {
      await audioRecorder.stop();

      const uri = audioRecorder.uri;

      if (!uri) {
        throw new Error("The recorder did not return a file URI.");
      }

      setRecordingUri(uri);

      console.log("Recording saved at:", uri);
    } catch (error: unknown) {
      console.error("Stopping recording failed:", error);

      Alert.alert(
        "Recording failed",
        "The application could not save the recording.",
      );
    }
  }
  async function handleTranscription() {
    if (!recordingUri) {
      Alert.alert(
        "No recording",
        "Record some audio before requesting transcription.",
      );

      return;
    }

    try {
      setIsTranscribing(true);
      setTranscription("");

      const text = await transcribeRecording(recordingUri);

      setTranscription(text);

      console.log("Transcription:", text);
    } catch (error: unknown) {
      console.error("Transcription failed:", error);

      const message =
        error instanceof Error
          ? error.message
          : "The recording could not be transcribed.";

      Alert.alert("Transcription failed", message);
    } finally {
      setIsTranscribing(false);
    }
  }
  const recordingDuration = Math.round(recorderState.durationMillis / 1000);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Voice Recording Spike</Text>

      <Text style={styles.description}>
        Record a short sentence to confirm microphone access works.
      </Text>

      <View style={styles.recorderCard}>
        <Text style={styles.status}>
          {recorderState.isRecording
            ? `Listening: ${recordingDuration}s`
            : "Ready to record"}
        </Text>

        <Pressable
          accessibilityRole="button"
          onPress={recorderState.isRecording ? stopRecording : startRecording}
          style={({ pressed }) => [
            styles.recordButton,
            recorderState.isRecording && styles.stopButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.recordButtonText}>
            {recorderState.isRecording ? "Stop recording" : "Start recording"}
          </Text>
        </Pressable>

        {recordingUri && (
          <View style={styles.result}>
            <Text style={styles.successText}>
              Recording created successfully
            </Text>

            <Text selectable style={styles.uriText}>
              <Pressable
                accessibilityRole="button"
                disabled={isTranscribing}
                onPress={handleTranscription}
                style={({ pressed }) => [
                  styles.transcribeButton,
                  pressed && styles.buttonPressed,
                  isTranscribing && styles.disabledButton,
                ]}
              >
                <Text style={styles.recordButtonText}>
                  {isTranscribing ? "Transcribing..." : "Transcribe recording"}
                </Text>
              </Pressable>

              {transcription ? (
                <View style={styles.transcriptionResult}>
                  <Text style={styles.transcriptionLabel}>Transcription</Text>

                  <Text style={styles.transcriptionText}>{transcription}</Text>
                </View>
              ) : null}
              {recordingUri}
            </Text>
          </View>
        )}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate("AddTask")}
        style={({ pressed }) => [
          styles.secondaryButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.secondaryButtonText}>Open Add Task</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: "700",
  },
  description: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  recorderCard: {
    marginTop: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    padding: 20,
  },
  status: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  recordButton: {
    minHeight: 52,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
  },
  stopButton: {
    backgroundColor: colors.danger,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  recordButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  result: {
    marginTop: 20,
  },
  successText: {
    color: colors.success,
    fontSize: 15,
    fontWeight: "600",
  },
  uriText: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  secondaryButton: {
    minHeight: 48,
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  transcribeButton: {
    minHeight: 48,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  transcriptionResult: {
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: colors.background,
    padding: 16,
  },
  transcriptionLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  transcriptionText: {
    marginTop: 8,
    color: colors.textPrimary,
    fontSize: 17,
    lineHeight: 25,
  },
});
