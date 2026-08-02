import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTasks } from "../features/tasks/TaskContext";
import type { RootStackParamList } from "../navigation/navigationTypes";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "AddTask">;

const TITLE_MAX_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 500;

export function AddTaskScreen({ navigation }: Props) {
  const { addTask } = useTasks();

  const descriptionInputRef = useRef<TextInput>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);

    if (titleError && value.trim()) {
      setTitleError(null);
    }

    if (formError) {
      setFormError(null);
    }
  }

  function handleDescriptionChange(value: string) {
    setDescription(value);

    if (formError) {
      setFormError(null);
    }
  }

  function handleSaveTask() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setTitleError("Enter a task title.");
      return;
    }

    if (isSaving) {
      return;
    }

    try {
      setIsSaving(true);
      setTitleError(null);
      setFormError(null);

      addTask({
        title: trimmedTitle,
        description,
      });

      navigation.goBack();
    } catch (error: unknown) {
      console.error("Creating task failed:", error);

      const message =
        error instanceof Error
          ? error.message
          : "The task could not be created.";

      setFormError(message);
      setIsSaving(false);
    }
  }

  const isSaveDisabled = isSaving || !title.trim();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.introduction}>
          <Text style={styles.heading}>What needs to be done?</Text>

          <Text style={styles.description}>
            Add a clear title and any extra details you may need later.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Task title</Text>

              <Text style={styles.requiredText}>Required</Text>
            </View>

            <TextInput
              accessibilityLabel="Task title"
              autoCapitalize="sentences"
              autoCorrect
              autoFocus
              maxLength={TITLE_MAX_LENGTH}
              onChangeText={handleTitleChange}
              onSubmitEditing={() => descriptionInputRef.current?.focus()}
              placeholder="e.g. Buy provisions"
              placeholderTextColor={colors.textSecondary}
              returnKeyType="next"
              style={[styles.input, titleError && styles.inputError]}
              value={title}
            />

            <View style={styles.fieldFooter}>
              <Text style={styles.errorText}>{titleError ?? ""}</Text>

              <Text style={styles.characterCount}>
                {title.length}/{TITLE_MAX_LENGTH}
              </Text>
            </View>
          </View>

          <View style={styles.field}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Description</Text>

              <Text style={styles.optionalText}>Optional</Text>
            </View>

            <TextInput
              ref={descriptionInputRef}
              accessibilityLabel="Task description"
              autoCapitalize="sentences"
              autoCorrect
              maxLength={DESCRIPTION_MAX_LENGTH}
              multiline
              onChangeText={handleDescriptionChange}
              placeholder="Add any useful details"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, styles.descriptionInput]}
              textAlignVertical="top"
              value={description}
            />

            <Text style={styles.characterCount}>
              {description.length}/{DESCRIPTION_MAX_LENGTH}
            </Text>
          </View>

          {formError ? (
            <View style={styles.formErrorContainer}>
              <Text style={styles.formErrorText}>{formError}</Text>
            </View>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityState={{
              disabled: isSaveDisabled,
            }}
            disabled={isSaveDisabled}
            onPress={handleSaveTask}
            style={({ pressed }) => [
              styles.saveButton,
              isSaveDisabled && styles.saveButtonDisabled,
              pressed && !isSaveDisabled && styles.saveButtonPressed,
            ]}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? "Saving..." : "Save task"}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={isSaving}
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.cancelButtonPressed,
            ]}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    padding: 24,
  },
  introduction: {
    marginBottom: 28,
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
  form: {
    width: "100%",
  },
  field: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  },
  requiredText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  optionalText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputError: {
    borderColor: colors.danger,
  },
  descriptionInput: {
    minHeight: 130,
  },
  fieldFooter: {
    minHeight: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  errorText: {
    flex: 1,
    color: colors.danger,
    fontSize: 13,
  },
  characterCount: {
    marginTop: 6,
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "right",
  },
  formErrorContainer: {
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: "#FEE2E2",
    padding: 12,
  },
  formErrorText: {
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20,
  },
  saveButton: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    minHeight: 48,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonPressed: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
  },
});
