import { File } from "expo-file-system";
import { fetch } from "expo/fetch";

type TranscriptionResponse = {
  text?: string;
  error?: string;
};

const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

export async function transcribeRecording(
  recordingUri: string,
): Promise<string> {
  if (!apiUrl) {
    throw new Error("EXPO_PUBLIC_API_URL is missing from .env.local");
  }

  const audioFile = new File(recordingUri);

  if (!audioFile.exists) {
    throw new Error("The recorded audio file does not exist.");
  }

  const formData = new FormData();

  formData.append("audio", audioFile, audioFile.name || "recording.m4a");

  const response = await fetch(`${apiUrl}/api/transcribe`, {
    method: "POST",
    body: formData,
  });

  const result = (await response.json()) as TranscriptionResponse;

  if (!response.ok) {
    throw new Error(result.error ?? "The transcription request failed.");
  }

  const text = result.text?.trim();

  if (!text) {
    throw new Error("The server returned an empty transcription.");
  }

  return text;
}
